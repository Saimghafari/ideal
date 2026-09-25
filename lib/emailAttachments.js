import fs from "fs/promises";
import path from "path";
import { BANK_ACCOUNTS, bankLogoCid, bankQrCid } from "@/lib/paymentDetails";

/** Load a file from public/ for email CID attachment */
async function loadPublicFile(publicPath) {
  if (!publicPath || publicPath.startsWith("http")) return null;
  const relative = publicPath.replace(/^\//, "");
  const absolute = path.join(process.cwd(), "public", relative);
  try {
    return await fs.readFile(absolute);
  } catch (error) {
    console.error("Failed to load payment asset:", absolute, error?.message);
    return null;
  }
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath || "").toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/png";
}

/**
 * Email attachments:
 * - Bank logos for all accounts
 * - QR only for accounts with a valid static qrImagePath (Ahtisham)
 */
export async function buildBankPaymentQrAttachments() {
  const attachments = [];

  for (const account of BANK_ACCOUNTS) {
    if (account.logoPath) {
      const logo = await loadPublicFile(account.logoPath);
      if (logo) {
        attachments.push({
          filename: `logo-${account.id}.png`,
          content: logo,
          cid: bankLogoCid(account.id),
          contentType: contentTypeFor(account.logoPath),
          contentDisposition: "inline",
        });
      }
    }

    if (account.qrImagePath) {
      const qr = await loadPublicFile(account.qrImagePath);
      if (qr) {
        attachments.push({
          filename: `qr-${account.id}.png`,
          content: qr,
          cid: bankQrCid(account.id),
          contentType: contentTypeFor(account.qrImagePath),
          contentDisposition: "inline",
        });
      }
    }
  }

  return attachments;
}

/** @deprecated Prefer buildBankPaymentQrAttachments() */
export async function buildPaymentQrAttachment() {
  const all = await buildBankPaymentQrAttachments();
  return all.find((a) => a.cid?.includes("-qr-")) || all[0] || null;
}
