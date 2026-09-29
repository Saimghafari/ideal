import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import {
  contactConfirmationEmail,
  contactInquiryEmail,
  INQUIRY_LABELS,
} from "@/email/contactInquiryEmail";
import ContactModel from "@/models/Contact.model";
import { CONTACT_EMAIL } from "@/lib/siteMeta";
import { z } from "zod";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .optional()
    .transform((v) => (v || "").trim()),
  inquiryType: z.enum(["general", "order", "commission", "visit"]),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
});

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();
    const validate = contactSchema.safeParse(payload);

    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields.", validate.error);
    }

    const { name, email, phone, inquiryType, message } = validate.data;

    if (phone && phone.length > 0 && phone.length < 7) {
      return response(false, 400, "Please enter a valid phone number.");
    }

    const inquiry = await ContactModel.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || "",
      inquiryType,
      message: message.trim(),
      status: "new",
    });

    // Contact-form notifications and visitor confirmations.
    const studioEmail =
      process.env.ADMIN_NOTIFICATION_EMAIL ||
      CONTACT_EMAIL;
    const about = INQUIRY_LABELS[inquiryType] || inquiryType;

    const studioMail = await sendMail(
      `New enquiry: ${about} — ${name}`,
      studioEmail,
      contactInquiryEmail({
        name,
        email,
        phone: phone || "",
        inquiryType,
        message,
      }),
      { replyTo: email }
    );

    if (!studioMail.success) {
      return response(
        false,
        500,
        studioMail.message || "Failed to send enquiry email. Please try again."
      );
    }

    // Best-effort confirmation to visitor (do not fail the request if this fails)
    await sendMail(
      "We received your message — Super Ideal",
      email,
      contactConfirmationEmail({ name, inquiryType }),
      { replyTo: studioEmail }
    );

    return response(true, 200, "Your message has been sent successfully.", {
      id: String(inquiry._id),
    });
  } catch (error) {
    return catchError(error);
  }
}
