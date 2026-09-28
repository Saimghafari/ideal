import { brandEmailShell } from "@/email/brandEmailShell";

const INQUIRY_LABELS = {
  general: "General enquiry",
  order: "Order support",
  commission: "Cakes and catering",
  visit: "Shop visit",
};

const row = (label, value) => `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #E6DFD2;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8A8174;width:36%;vertical-align:top;">
      ${label}
    </td>
    <td style="padding:10px 0;border-bottom:1px solid #E6DFD2;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:300;color:#1C1610;vertical-align:top;">
      ${value}
    </td>
  </tr>
`;

/** Studio notification when someone submits the contact form */
export const contactInquiryEmail = ({
  name,
  email,
  phone,
  inquiryType,
  message,
}) => {
  const about = INQUIRY_LABELS[inquiryType] || inquiryType;
  const safeMessage = String(message || "")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");

  const bodyHtml = `
    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#55110F;">
      New enquiry
    </p>
    <h1 style="margin:0 0 18px;font-size:26px;font-weight:400;color:#1C1610;">
      Contact form message
    </h1>
    <p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:300;line-height:1.7;color:#5C5348;">
      A visitor sent a message from the Velora contact page.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${row("Writing about", about)}
      ${row("Name", name)}
      ${row(
        "Email",
        `<a href="mailto:${email}" style="color:#55110F;text-decoration:none;">${email}</a>`
      )}
      ${phone ? row("Phone", phone) : ""}
    </table>
    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8A8174;">
      Message
    </p>
    <div style="padding:16px 18px;background:#F3EEE4;border-left:3px solid #B8933D;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:300;line-height:1.75;color:#1C1610;">
      ${safeMessage}
    </div>
  `;

  return brandEmailShell({
    title: `New enquiry — ${about}`,
    preview: `${name} · ${about}`,
    bodyHtml,
  });
};

/** Confirmation email to the visitor */
export const contactConfirmationEmail = ({ name, inquiryType }) => {
  const about = INQUIRY_LABELS[inquiryType] || inquiryType;

  const bodyHtml = `
    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#55110F;">
      Message received
    </p>
    <h1 style="margin:0 0 18px;font-size:26px;font-weight:400;color:#1C1610;">
      Thank you, ${name}.
    </h1>
    <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:300;line-height:1.75;color:#5C5348;">
      We have received your note about <strong style="color:#1C1610;font-weight:500;">${about}</strong>.
      Our team will respond within 1–2 business days.
    </p>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:300;line-height:1.75;color:#5C5348;">
      In the meantime, you can browse sweets, cakes, and bakery from Super Ideal.
    </p>
  `;

  return brandEmailShell({
    title: "We received your message — Super Ideal",
    preview: "Thank you for writing to Super Ideal.",
    bodyHtml,
  });
};

export { INQUIRY_LABELS };
