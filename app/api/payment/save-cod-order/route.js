import {
  orderAdminNotification,
  orderNotification,
} from "@/email/orderNotification";
import { connectDB } from "@/lib/databaseConnection";
import { enrichOrderProductsForEmail } from "@/lib/enrichOrderProductsForEmail";
import { buildBankPaymentQrAttachments } from "@/lib/emailAttachments";
import { getPaymentDetails } from "@/lib/paymentDetails";
import { catchError, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OrderModel from "@/models/Order.model";
import { z } from "zod";

const objectIdOrEmpty = z
  .string()
  .optional()
  .nullable()
  .transform((v) => {
    if (!v || v === "null" || v === "undefined") return null;
    return /^[a-f\d]{24}$/i.test(v) ? v : null;
  });

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();

    const productSchema = z.object({
      productId: z.string().length(24, "Invalid product id format"),
      variantId: objectIdOrEmpty,
      name: z.string().min(1),
      size: z.string().optional().nullable(),
      qty: z.number().min(1),
      mrp: z.number().nonnegative(),
      sellingPrice: z.number().nonnegative(),
    });

    const orderSchema = zSchema
      .pick({
        name: true,
        email: true,
        phone: true,
        country: true,
        state: true,
        city: true,
        pincode: true,
        landmark: true,
        ordernote: true,
      })
      .extend({
        userId: z.string().optional(),
        subtotal: z.number().nonnegative(),
        discount: z.number().nonnegative(),
        couponDiscountAmount: z.number().nonnegative(),
        totalAmount: z.number().nonnegative(),
        currency: z.enum(["USD", "PKR"]).optional().default("PKR"),
        products: z.array(productSchema).min(1),
      });

    const validate = orderSchema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields.", validate.error);
    }

    const validatedData = validate.data;

    const orderId = `OI-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const productsForDb = validatedData.products.map((p) => ({
      productId: p.productId,
      ...(p.variantId ? { variantId: p.variantId } : {}),
      name: p.name,
      size: p.size || null,
      qty: p.qty,
      mrp: p.mrp,
      sellingPrice: p.sellingPrice,
    }));

    await OrderModel.create({
      user: validatedData.userId || undefined,
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      country: validatedData.country,
      state: validatedData.state,
      city: validatedData.city,
      pincode: validatedData.pincode,
      landmark: validatedData.landmark,
      ordernote: validatedData.ordernote,
      products: productsForDb,
      discount: validatedData.discount,
      couponDiscountAmount: validatedData.couponDiscountAmount,
      totalAmount: validatedData.totalAmount,
      subtotal: validatedData.subtotal,
      currency: validatedData.currency || "PKR",
      payment_method: "Invoice",
      order_id: orderId,
      status: "unpaid",
    });

    const emailProducts = await enrichOrderProductsForEmail(productsForDb);
    const currency = validatedData.currency || "PKR";
    const { formatMoney } = await import("@/lib/formatCurrency");
    const totalLabel = formatMoney(validatedData.totalAmount, currency);

    const mailData = {
      order_id: orderId,
      customer_name: validatedData.name,
      subtotal: validatedData.subtotal,
      discount: validatedData.discount,
      couponDiscountAmount: validatedData.couponDiscountAmount,
      totalAmount: validatedData.totalAmount,
      currency,
      products: emailProducts,
      address: `${validatedData.landmark}, ${validatedData.city}, ${validatedData.state}, ${validatedData.country}, ${validatedData.pincode}`,
      phone: validatedData.phone,
      email: validatedData.email,
      order_date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      payment_method: "Bank Transfer",
    };

    let customerEmailSent = false;

    try {
      const payment = getPaymentDetails();
      const attachments = await buildBankPaymentQrAttachments();
      const plainText = [
        `Hello ${validatedData.name},`,
        ``,
        `Thank you for your Velora order ${orderId}.`,
        `Total: ${totalLabel}`,
        `Please complete payment by bank transfer. Include Order ID ${orderId} as the payment reference.`,
        ``,
        ...(payment.bankAccounts || []).flatMap((a) => [
          `${a.bankName}`,
          a.iban
            ? `  ${a.accountName} · IBAN: ${a.iban}`
            : `  ${a.accountName} · ${a.accountNumber} · Sort ${a.sortCode}`,
          a.qrImagePath ? `  QR: available (scan Ahtisham payment QR in email)` : "",
          ``,
        ]),
        `— Velora`,
      ]
        .filter((line) => line !== "")
        .join("\n");

      const result = await sendMail(
        `Your Velora order ${orderId}`,
        validatedData.email,
        orderNotification(mailData),
        {
          ...(attachments.length ? { attachments } : {}),
          text: plainText,
          refId: orderId,
          // Replies go to studio Gmail (not no-reply@)
          replyTo:
            process.env.ADMIN_NOTIFICATION_EMAIL ||
            "dectorreofficial@gmail.com",
        }
      );

      customerEmailSent = Boolean(result?.success);

      if (!customerEmailSent) {
        console.error(
          `Customer order email NOT sent for ${orderId} (${validatedData.email}):`,
          result?.message
        );
      }
    } catch (error) {
      console.error("Customer order email error:", error);
    }

    try {
      const studioEmail =
        process.env.ADMIN_NOTIFICATION_EMAIL ||
        "dectorreofficial@gmail.com";
      const result = await sendMail(
        `New Velora order ${orderId}`,
        studioEmail,
        orderAdminNotification(mailData),
        { replyTo: validatedData.email, refId: orderId }
      );

      if (!result?.success) {
        console.error(
          `Admin order email NOT sent for ${orderId}:`,
          result?.message
        );
      }
    } catch (error) {
      console.error("Admin order email error:", error);
    }

    return response(true, 200, "Order placed successfully.", {
      order_id: orderId,
      emailSent: customerEmailSent,
    });
  } catch (error) {
    return catchError(error);
  }
}
