import nodemailer from "nodemailer";
import { CONTACT_EMAIL } from "@/lib/siteMeta";

const DEFAULT_REPLY_TO =
  process.env.ADMIN_NOTIFICATION_EMAIL || CONTACT_EMAIL;

function getSmtpConfig() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_EMAIL || CONTACT_EMAIL;
  const pass = process.env.SMTP_PASSWORD;

  return { host, port, user, pass };
}

/**
 * Send transactional email through Gmail SMTP (nodemailer).
 */
export const sendMail = async (subject, receiver, body, extras = {}) => {
  const { host, port, user, pass } = getSmtpConfig();

  if (!user || !pass) {
    console.error("Gmail SMTP credentials are missing — email not sent:", subject);
    return { success: false, message: "Email service is not configured." };
  }

  const fromName = extras.fromName || "Velora";
  const fromEmail = extras.fromEmail || user;
  const replyTo = extras.replyTo || DEFAULT_REPLY_TO;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  const options = {
    from: `"${fromName}" <${fromEmail}>`,
    to: receiver,
    subject,
    html: body,
    ...(extras.text ? { text: extras.text } : {}),
    replyTo,
    ...(extras.attachments?.length ? { attachments: extras.attachments } : {}),
    headers: {
      "X-Mailer": "Velora Atelier",
      "X-Entity-Ref-ID": String(extras.refId || Date.now()),
      ...(extras.headers || {}),
    },
  };

  try {
    const info = await transporter.sendMail(options);
    return { success: true, id: info.messageId };
  } catch (error) {
    console.error("Gmail SMTP error:", error);
    return { success: false, message: error.message };
  }
};

/** Alias kept so older imports keep working */
export const sendSmtpMail = sendMail;
