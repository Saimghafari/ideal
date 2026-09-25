import { brandEmailShell } from "@/email/brandEmailShell";

export const emailVerificationLink = (link) => {
  const bodyHtml = `
    <div style="text-align:center;">
      <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#55110F;">
        Welcome
      </p>
      <h1 style="margin:0 0 18px;font-size:26px;font-weight:400;color:#1C1610;">
        Verify your email
      </h1>
      <p style="margin:0 auto 28px;max-width:420px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:300;line-height:1.75;color:#5C5348;">
        Thank you for joining <strong style="color:#1C1610;font-weight:500;">Velora</strong> —
        premium embroidery wall décor and thread art for modern interiors.
        Please confirm your email to complete registration.
      </p>

      <a href="${link}"
         style="display:inline-block;padding:14px 36px;border:1px solid #1C1610;background:#1C1610;color:#FBF7F0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;text-decoration:none;margin-bottom:24px;">
        Verify Email
      </a>

      <p style="margin:0 auto 12px;max-width:400px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:300;line-height:1.7;color:#8A8174;">
        If the button does not work, open this link:
      </p>
      <p style="margin:0 auto 24px;max-width:420px;word-break:break-all;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;">
        <a href="${link}" style="color:#55110F;text-decoration:underline;">${link}</a>
      </p>
      <p style="margin:0 auto;max-width:400px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:300;line-height:1.7;color:#8A8174;">
        This link expires in <strong style="color:#1C1610;font-weight:500;">1 hour</strong>.
        If you did not create an account, you can ignore this message.
      </p>
    </div>
  `;

  return brandEmailShell({
    title: "Verify your email — Velora",
    preview: "Confirm your email to complete your Velora account.",
    bodyHtml,
  });
};
