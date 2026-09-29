import { brandEmailShell } from "@/email/brandEmailShell";

export const otpEmail = (otp) => {
  const bodyHtml = `
    <div style="text-align:center;">
      <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#55110F;">
        Security
      </p>
      <h1 style="margin:0 0 18px;font-size:26px;font-weight:400;color:#1C1610;">
        Email Verification
      </h1>
      <p style="margin:0 auto 28px;max-width:420px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:300;line-height:1.75;color:#5C5348;">
        Thank you for joining <strong style="color:#1C1610;font-weight:500;">Super Ideal</strong>.
        Use the one-time password below to verify your email address.
      </p>

      <div style="display:inline-block;padding:4px;border:1px solid #E6DFD2;background:#F3EEE4;margin-bottom:28px;">
        <div style="padding:18px 36px;background:#FBF7F0;border:1px solid #B8933D;">
          <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#8A8174;">
            Your OTP
          </p>
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:34px;letter-spacing:0.28em;font-weight:400;color:#55110F;">
            ${otp}
          </p>
        </div>
      </div>

      <p style="margin:0 auto;max-width:400px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:300;line-height:1.7;color:#8A8174;">
        This code is valid for <strong style="color:#1C1610;font-weight:500;">10 minutes</strong>.
        Do not share it with anyone. If you did not request this, you can ignore this email.
      </p>
    </div>
  `;

  return brandEmailShell({
    title: "Email Verification — Super Ideal",
    preview: `Your verification code is ${otp}`,
    bodyHtml,
  });
};
