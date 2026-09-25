import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#141910"/>
  <path d="M168 138h58l30 188 30-188h58L286 392h-60L168 138z" fill="#F4EFE6"/>
</svg>`;

async function png(size, dest) {
  const buffer = await sharp(Buffer.from(svg))
    .resize(size, size, { fit: "fill" })
    .png()
    .toBuffer();
  writeFileSync(dest, buffer);
  return buffer;
}

function icoFromPng(png32) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);
  entry.writeUInt8(32, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png32.length, 8);
  entry.writeUInt32LE(22, 12);

  return Buffer.concat([header, entry, png32]);
}

const png32 = await png(32, join(root, "public/favicon-32x32.png"));
await png(16, join(root, "public/favicon-16x16.png"));
await png(48, join(root, "public/favicon-48x48.png"));
await png(96, join(root, "public/favicon-96x96.png"));
await png(180, join(root, "public/apple-touch-icon.png"));
await png(192, join(root, "public/android-chrome-192x192.png"));
await png(512, join(root, "public/android-chrome-512x512.png"));
await png(192, join(root, "public/icons/icon-192x192.png"));
await png(512, join(root, "public/icons/icon-512x512.png"));
await png(150, join(root, "public/icons/mstile-150x150.png"));
await png(512, join(root, "app/icon.png"));
await png(180, join(root, "app/apple-icon.png"));

writeFileSync(join(root, "public/favicon.ico"), icoFromPng(png32));
writeFileSync(join(root, "app/icon.svg"), svg);

console.log("Velora favicons written");
