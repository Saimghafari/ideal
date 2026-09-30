import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import BranchModel from "@/models/Branch.model";
import OrderModel from "@/models/Order.model";
import ProductModel from "@/models/Product.model";
import { isValidObjectId } from "mongoose";
import { z } from "zod";

const objectIdOrEmpty = z
  .string()
  .optional()
  .nullable()
  .transform((value) => {
    if (!value || value === "null" || value === "undefined") return null;
    return isValidObjectId(value) ? value : null;
  });

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();

    const productSchema = z.object({
      productId: z.string().min(1),
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
        phone: true,
        country: true,
        city: true,
        ordernote: true,
      })
      .extend({
        email: z.string().optional().default(""),
        userId: z.string().optional(),
        landmark: z.string().optional(),
        branchId: z.string().optional().nullable(),
        serviceType: z.enum(["delivery", "pickup"]).optional().default("delivery"),
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
    const productIds = validatedData.products
      .map((item) => item.productId)
      .filter((id) => isValidObjectId(id));

    const catalogProducts = productIds.length
      ? await ProductModel.find({ _id: { $in: productIds }, deletedAt: null })
          .select("deliverable branches")
          .lean()
      : [];

    const needsPickup = catalogProducts.some((item) => item.deliverable === false);
    const serviceType = needsPickup ? "pickup" : validatedData.serviceType || "delivery";

    if (needsPickup && validatedData.serviceType === "delivery") {
      return response(false, 400, "Some items are in-store only. Choose counter pickup.");
    }

    let branch = null;
    const activeBranches = await BranchModel.countDocuments({ deletedAt: null, isActive: { $ne: false } });
    if (activeBranches > 0) {
      if (!validatedData.branchId || !isValidObjectId(validatedData.branchId)) {
        return response(false, 400, "Choose a branch for this order.");
      }
      branch = await BranchModel.findOne({
        _id: validatedData.branchId,
        deletedAt: null,
        isActive: { $ne: false },
      }).lean();
      if (!branch) return response(false, 400, "That branch is not available.");

      const wrongBranch = catalogProducts.some((item) => {
        const assigned = (item.branches || []).map(String);
        return assigned.length > 0 && !assigned.includes(String(branch._id));
      });
      if (wrongBranch) {
        return response(false, 400, "One of these items is not available at the selected branch.");
      }
    }

    const orderId = `OI-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const now = new Date();

    const productsForDb = validatedData.products.map((item) => ({
      ...(isValidObjectId(item.productId) ? { productId: item.productId } : {}),
      ...(item.variantId ? { variantId: item.variantId } : {}),
      name: item.name,
      size: item.size || null,
      qty: item.qty,
      mrp: item.mrp,
      sellingPrice: item.sellingPrice,
    }));

    await OrderModel.create({
      user: validatedData.userId || undefined,
      name: validatedData.name,
      email: validatedData.email || "",
      phone: validatedData.phone,
      country: validatedData.country,
      city: validatedData.city,
      landmark: validatedData.landmark || "",
      ordernote: validatedData.ordernote,
      products: productsForDb,
      discount: validatedData.discount,
      couponDiscountAmount: validatedData.couponDiscountAmount,
      totalAmount: validatedData.totalAmount,
      subtotal: validatedData.subtotal,
      currency: validatedData.currency || "PKR",
      payment_method: "COD",
      order_id: orderId,
      status: "processing",
      branch: branch?._id || null,
      branchName: branch ? branch.shortName || branch.name : "",
      serviceType,
      fulfillmentStage: "received",
      prepMinutes: branch?.prepMinutes === 10 ? 10 : 20,
      stageUpdatedAt: now,
    });

    return response(true, 200, "Order placed successfully.", {
      order_id: orderId,
    });
  } catch (error) {
    return catchError(error);
  }
}
