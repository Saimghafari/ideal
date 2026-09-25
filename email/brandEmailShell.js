import { SITE_URL, BRAND_NAME } from "@/lib/siteMeta";

/** Shared brand shell for transactional emails */
export const brandEmailShell = ({ title, preview, bodyHtml }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#FFF2E1;font-family:Georgia,'Times New Roman',serif;color:#4B2E1E;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preview || ""}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFF2E1;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#FBF8F2;border:1px solid #E8D9C4;">
          <tr>
            <td style="height:3px;background:#E45700;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px 32px 18px;text-align:center;">
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:#E45700;">
                Modern Clothing
              </p>
              <p style="margin:0;font-size:26px;font-weight:400;letter-spacing:0.22em;text-transform:uppercase;color:#4B2E1E;">
                ${BRAND_NAME}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;">
              <div style="height:1px;background:linear-gradient(to right,transparent,#E45700,transparent);margin-bottom:28px;"></div>
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:22px 32px 28px;border-top:1px solid #E8D9C4;text-align:center;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#7A5A45;">
                <a href="${SITE_URL}" style="color:#4B2E1E;text-decoration:none;">${BRAND_NAME}</a>
              </p>
              <p style="margin:12px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:#7A5A45;">
                ${BRAND_NAME} · Clothing in Pakistani rupees<br/>
                For questions, use the contact form on our website.
              </p>
              <p style="margin:12px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8A8174;">
                © ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
