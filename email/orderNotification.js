import { brandEmailShell } from "@/email/brandEmailShell";
import {
  bankLogoCid,
  bankQrCid,
  getPaymentDetails,
} from "@/lib/paymentDetails";
import { formatMoney } from "@/lib/formatCurrency";
import { SITE_URL } from "@/lib/siteMeta";

const money = (n, currency = "PKR") => formatMoney(n, currency);

const bankDetailsHtml = (account) => {
  if (account.iban) {
    return `
      <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#5C5348;line-height:1.6;">
        <strong style="color:#1C1610;">Account title:</strong> ${account.accountName}
      </p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#5C5348;line-height:1.6;word-break:break-all;">
        <strong style="color:#1C1610;">IBAN:</strong> ${account.iban}
      </p>`;
  }
  return `
      <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#5C5348;line-height:1.6;">
        <strong style="color:#1C1610;">Account title:</strong> ${account.accountName}
      </p>
      <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#5C5348;line-height:1.6;">
        <strong style="color:#1C1610;">Account number:</strong> ${account.accountNumber}
      </p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#5C5348;line-height:1.6;">
        <strong style="color:#1C1610;">Sort code:</strong> ${account.sortCode}
      </p>`;
};

const paymentInstructionsBlock = ({ order_id, totalAmount, currency = "PKR" }) => {
  const payment = getPaymentDetails();
  const accounts = payment.bankAccounts || [];

  const accountCards = accounts
    .map((account, index) => {
      const logoCid = bankLogoCid(account.id);
      const hasQr = Boolean(account.qrImagePath);
      const qrCid = bankQrCid(account.id);
      const region =
        account.country === "GB"
          ? "United Kingdom"
          : account.country === "PK"
            ? "Pakistan"
            : account.country || "";
      const topMargin = index === 0 ? "0" : "16px";

      const logoBg = "#FFFFFF";

      const logoCell = `
        <td style="width:100px;vertical-align:middle;">
          <img src="cid:${logoCid}" width="92" height="50" alt="${account.bankName}" style="display:block;width:92px;height:50px;border:1px solid #E6DFD2;background:${logoBg};object-fit:contain;" />
        </td>`;

      const qrColumn = hasQr
        ? `
                <td style="vertical-align:top;width:140px;padding-right:16px;">
                  <img src="cid:${qrCid}" width="132" alt="${account.accountName} payment QR" style="display:block;width:132px;height:auto;max-width:132px;border:1px solid #E6DFD2;background:#fff;" />
                  <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#8A8174;text-align:center;">
                    Scan to pay
                  </p>
                </td>`
        : "";

      return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:${topMargin};border:1px solid #E6DFD2;background:#FFFFFF;">
        <tr>
          <td style="padding:16px 16px 14px;border-bottom:1px solid #F0EBE0;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                ${logoCell}
                <td style="vertical-align:middle;padding-left:12px;">
                  <p style="margin:0 0 2px;font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:400;color:#1C1610;">
                    ${account.bankName}
                  </p>
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#8A8174;">
                    ${region}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                ${qrColumn}
                <td style="vertical-align:top;">
                  ${bankDetailsHtml(account)}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;
    })
    .join("");

  return `
    <div style="margin:0 0 28px;padding:22px 20px;background:#FBF7F0;border:1px solid #E6DFD2;">
      <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#55110F;">
        Payment details
      </p>
      <h2 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:400;color:#1C1610;">
        Bank transfer
      </h2>
      <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:300;line-height:1.75;color:#5C5348;">
        ${payment.instructions}
      </p>
      <p style="margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1C1610;">
        <strong>Amount due:</strong> ${money(totalAmount, currency)}
      </p>
      <p style="margin:0 0 18px;padding:10px 12px;background:#F7F0D8;border-left:3px solid #B8933D;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#5C5348;">
        <strong style="color:#1C1610;">Important:</strong> Use Order ID
        <strong style="color:#1C1610;">${order_id}</strong> as your transfer / payment reference.
      </p>
      ${accountCards}
    </div>
  `;
};

const productRows = (products = [], currency = "PKR") =>
  products
    .map((p) => {
      const img =
        p.image ||
        "https://www.dectorre.com/assets/images/img-placeholder.webp";
      const size = p.size ? `<br/><span style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#8A8174;">${p.size}</span>` : "";
      return `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #E6DFD2;vertical-align:top;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:14px;vertical-align:top;">
                <img src="${img}" width="64" height="64" alt="${p.name || "Piece"}" style="display:block;width:64px;height:64px;object-fit:cover;border:1px solid #E6DFD2;background:#F3EEE4;" />
              </td>
              <td style="vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:300;color:#1C1610;line-height:1.45;">
                <strong style="font-weight:500;">${p.name || "Piece"}</strong>${size}
                <br/><span style="font-size:12px;color:#8A8174;">Qty ${p.qty} · ${money(p.sellingPrice, currency)}</span>
              </td>
            </tr>
          </table>
        </td>
        <td style="padding:14px 0;border-bottom:1px solid #E6DFD2;text-align:right;vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1C1610;white-space:nowrap;">
          ${money((p.qty || 0) * (p.sellingPrice || 0), currency)}
        </td>
      </tr>`;
    })
    .join("");

const summaryRows = ({
  subtotal,
  discount,
  couponDiscountAmount,
  totalAmount,
  currency = "PKR",
}) => `
  <tr>
    <td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8A8174;">Subtotal</td>
    <td style="padding:6px 0;text-align:right;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1C1610;">${money(subtotal, currency)}</td>
  </tr>
  ${
    Number(discount) > 0
      ? `<tr>
    <td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8A8174;">Discount</td>
    <td style="padding:6px 0;text-align:right;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#55110F;">−${money(discount, currency)}</td>
  </tr>`
      : ""
  }
  ${
    Number(couponDiscountAmount) > 0
      ? `<tr>
    <td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8A8174;">Coupon</td>
    <td style="padding:6px 0;text-align:right;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#55110F;">−${money(couponDiscountAmount, currency)}</td>
  </tr>`
      : ""
  }
  <tr>
    <td style="padding:14px 0 0;border-top:1px solid #E6DFD2;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8A8174;">Total</td>
    <td style="padding:14px 0 0;border-top:1px solid #E6DFD2;text-align:right;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#1C1610;">${money(totalAmount, currency)}</td>
  </tr>
`;

/** Customer: order placed */
export const orderNotification = (data) => {
  const {
    order_id,
    customer_name,
    subtotal,
    discount,
    couponDiscountAmount,
    totalAmount,
    products,
    address,
    phone,
    email,
    order_date,
    payment_method = "Bank Transfer",
    currency = "PKR",
  } = data;

  const bodyHtml = `
    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#55110F;">
      Order confirmation
    </p>
    <h1 style="margin:0 0 12px;font-size:28px;font-weight:400;color:#1C1610;">
      Thank you, ${customer_name}.
    </h1>
    <p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:300;line-height:1.75;color:#5C5348;">
      We received your order. Please complete payment by bank transfer using the details below.
      Once payment is confirmed, we will begin preparing your pieces.
    </p>

    <div style="margin-bottom:24px;padding:16px 18px;background:#F3EEE4;border-left:3px solid #B8933D;">
      <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#5C5348;">
        <strong style="color:#1C1610;">Order ID:</strong> ${order_id}
      </p>
      <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#5C5348;">
        <strong style="color:#1C1610;">Date:</strong> ${order_date}
      </p>
      <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#5C5348;">
        <strong style="color:#1C1610;">Status:</strong> Awaiting payment
      </p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#5C5348;">
        <strong style="color:#1C1610;">Payment method:</strong> ${payment_method}
      </p>
    </div>

    ${paymentInstructionsBlock({ order_id, totalAmount, currency })}

    <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8A8174;">
      Pieces
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;">
      ${productRows(products, currency)}
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${summaryRows({ subtotal, discount, couponDiscountAmount, totalAmount, currency })}
    </table>

    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8A8174;">
      Delivery
    </p>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:300;line-height:1.7;color:#5C5348;">
      ${address}<br/>
      Phone: ${phone}<br/>
      Email: <a href="mailto:${email}" style="color:#55110F;text-decoration:none;">${email}</a>
    </p>
  `;

  return brandEmailShell({
    title: `Your Velora order ${order_id}`,
    preview: `Thank you for your order ${order_id}. Payment details are inside.`,
    bodyHtml,
  });
};

/** Admin: new order alert */
export const orderAdminNotification = (data) => {
  const {
    order_id,
    customer_name,
    subtotal,
    discount,
    couponDiscountAmount,
    totalAmount,
    products,
    address,
    phone,
    email,
    order_date,
    payment_method = "Bank Transfer",
    currency = "PKR",
  } = data;

  const bodyHtml = `
    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#55110F;">
      New order
    </p>
    <h1 style="margin:0 0 12px;font-size:26px;font-weight:400;color:#1C1610;">
      Order received
    </h1>
    <p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:300;line-height:1.75;color:#5C5348;">
      A customer placed a new order. Status is <strong>Unpaid</strong> — awaiting bank transfer verification.
    </p>

    <div style="margin-bottom:24px;padding:16px 18px;background:#F3EEE4;border-left:3px solid #B8933D;">
      <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#5C5348;">
        <strong style="color:#1C1610;">Order ID:</strong> ${order_id}
      </p>
      <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#5C5348;">
        <strong style="color:#1C1610;">Customer:</strong> ${customer_name}
      </p>
      <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#5C5348;">
        <strong style="color:#1C1610;">Date:</strong> ${order_date}
      </p>
      <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#5C5348;">
        <strong style="color:#1C1610;">Status:</strong> Unpaid
      </p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#5C5348;">
        <strong style="color:#1C1610;">Payment:</strong> ${payment_method}
      </p>
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;">
      ${productRows(products, currency)}
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${summaryRows({ subtotal, discount, couponDiscountAmount, totalAmount, currency })}
    </table>

    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8A8174;">
      Shipping
    </p>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:300;line-height:1.7;color:#5C5348;">
      ${address}<br/>
      Phone: ${phone}<br/>
      Email: <a href="mailto:${email}" style="color:#55110F;text-decoration:none;">${email}</a>
    </p>
  `;

  return brandEmailShell({
    title: `New order — ${order_id}`,
    preview: `New order from ${customer_name}: ${order_id}`,
    bodyHtml,
  });
};

/** Customer: status-specific templates */
const STATUS_THEMES = {
  unpaid: {
    label: "Awaiting payment",
    accent: "#B45309",
    badgeBg: "#FEF3C7",
    badgeBorder: "#F59E0B",
    icon: "◎",
    eyebrow: "Order update",
    title: "Your order is awaiting payment",
    preview: "Your Velora order is awaiting payment.",
    message: (name, orderId) =>
      `Hello ${name}, order <strong style="color:#1C1610;font-weight:500;">${orderId}</strong> is awaiting payment. Please use the bank transfer details from your order confirmation email and include the Order ID as the payment reference.`,
    note: "Once payment is verified, we will mark your order as Paid and begin processing.",
  },
  paid: {
    label: "Paid",
    accent: "#166534",
    badgeBg: "#DCFCE7",
    badgeBorder: "#86EFAC",
    icon: "✓",
    eyebrow: "Payment received",
    title: "Payment verified — thank you",
    preview: "Your payment was verified. Your order is now paid.",
    message: (name, orderId) =>
      `Hello ${name}, we have verified payment for order <strong style="color:#1C1610;font-weight:500;">${orderId}</strong>. Your order is marked as Paid.`,
    note: "Next, our atelier will move your pieces into Processing and prepare them with care.",
  },
  processing: {
    label: "Processing",
    accent: "#C4A035",
    badgeBg: "#F7F0D8",
    badgeBorder: "#C4A035",
    icon: "◆",
    eyebrow: "In the atelier",
    title: "Your order is being prepared",
    preview: "We’re preparing your embroidery wall décor with care.",
    message: (name, orderId) =>
      `Hello ${name}, good news — order <strong style="color:#1C1610;font-weight:500;">${orderId}</strong> is now in preparation. Our studio is carefully finishing your pieces.`,
    note: "You’ll receive another update as soon as your order ships.",
  },
  shipped: {
    label: "Shipped",
    accent: "#1F6B4A",
    badgeBg: "#E5F2EB",
    badgeBorder: "#1F6B4A",
    icon: "✈",
    eyebrow: "On the way",
    title: "Your order has shipped",
    preview: "Your Velora pieces are on their way.",
    message: (name, orderId) =>
      `Hello ${name}, your order <strong style="color:#1C1610;font-weight:500;">${orderId}</strong> has left the atelier and is on its journey to you.`,
    note: "Please keep an eye on your doorstep. Handle the package gently — it contains finely finished wall art.",
  },
  delivered: {
    label: "Delivered",
    accent: "#1F6B4A",
    badgeBg: "#E5F2EB",
    badgeBorder: "#1F6B4A",
    icon: "✓",
    eyebrow: "Arrived",
    title: "Your order has been delivered",
    preview: "Your embroidery wall décor has arrived.",
    message: (name, orderId) =>
      `Hello ${name}, order <strong style="color:#1C1610;font-weight:500;">${orderId}</strong> has been marked as delivered. We hope your new pieces bring quiet beauty to your walls.`,
    note: "If anything arrives damaged, contact us within 48 hours with photographs and we will assist you.",
  },
  cancelled: {
    label: "Cancelled",
    accent: "#8B1E1A",
    badgeBg: "#F8E8E7",
    badgeBorder: "#8B1E1A",
    icon: "✕",
    eyebrow: "Order cancelled",
    title: "Your order has been cancelled",
    preview: "Your order was cancelled. We’re here if you need help.",
    message: (name, orderId) =>
      `Hello ${name}, order <strong style="color:#1C1610;font-weight:500;">${orderId}</strong> has been cancelled. If this was unexpected, or you need help placing a new order, please reach out.`,
    note: "Contact Velora through the website contact form if you need help.",
  },
  pending: {
    label: "Pending",
    accent: "#8A8174",
    badgeBg: "#F3EEE4",
    badgeBorder: "#C4B8A5",
    icon: "◌",
    eyebrow: "Order update",
    title: "Your order is pending",
    preview: "Your Velora order status is pending.",
    message: (name, orderId) =>
      `Hello ${name}, order <strong style="color:#1C1610;font-weight:500;">${orderId}</strong> is currently pending confirmation.`,
    note: "We’ll update you as soon as it moves to the next stage.",
  },
  unverified: {
    label: "Unverified",
    accent: "#8A8174",
    badgeBg: "#F3EEE4",
    badgeBorder: "#C4B8A5",
    icon: "?",
    eyebrow: "Action needed",
    title: "Order needs verification",
    preview: "Your order requires verification.",
    message: (name, orderId) =>
      `Hello ${name}, order <strong style="color:#1C1610;font-weight:500;">${orderId}</strong> is marked as unverified. Our team may contact you shortly.`,
    note: "You can also write to us through the Velora contact form.",
  },
};

export const orderStatusEmail = ({
  customer_name,
  order_id,
  status,
  products = [],
  currency = "PKR",
}) => {
  const key = String(status || "pending").toLowerCase();
  const orderCurrency = "PKR";
  const theme = STATUS_THEMES[key] || {
    label: String(status || "Updated").replace(/^\w/, (c) => c.toUpperCase()),
    accent: "#55110F",
    badgeBg: "#F3EEE4",
    badgeBorder: "#B8933D",
    icon: "◆",
    eyebrow: "Order update",
    title: "Your order status has changed",
    preview: `Your order is now ${status}.`,
    message: (name, orderId) =>
      `Hello ${name}, your order <strong style="color:#1C1610;font-weight:500;">${orderId}</strong> status is now <strong>${status}</strong>.`,
    note: "Thank you for choosing Velora.",
  };

  const contactBlock =
    key === "cancelled"
      ? `
    <div style="margin:24px 0 0;padding:18px 20px;background:${theme.badgeBg};border:1px solid ${theme.badgeBorder};text-align:center;">
      <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${theme.accent};">
        Need help?
      </p>
      <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:300;line-height:1.7;color:#5C5348;">
        Velora can help with a replacement order or any questions.
      </p>
      <a href="${SITE_URL}/contact-us"
         style="display:inline-block;padding:12px 28px;background:${theme.accent};color:#FBF7F0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;">
        Contact Velora
      </a>
    </div>`
      : "";

  const shippedTrack =
    key === "shipped"
      ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;">
      <tr>
        <td align="center" style="padding:8px;">
          <div style="width:36px;height:36px;line-height:36px;border-radius:50%;background:${theme.badgeBg};border:1px solid ${theme.badgeBorder};font-size:14px;color:${theme.accent};">1</div>
          <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#8A8174;">Packed</p>
        </td>
        <td style="width:40px;border-top:2px solid ${theme.accent};font-size:0;line-height:0;">&nbsp;</td>
        <td align="center" style="padding:8px;">
          <div style="width:36px;height:36px;line-height:36px;border-radius:50%;background:${theme.accent};color:#fff;font-size:14px;">✈</div>
          <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:${theme.accent};font-weight:600;">Shipped</p>
        </td>
        <td style="width:40px;border-top:2px dashed #C4B8A5;font-size:0;line-height:0;">&nbsp;</td>
        <td align="center" style="padding:8px;">
          <div style="width:36px;height:36px;line-height:36px;border-radius:50%;background:#F3EEE4;border:1px solid #E6DFD2;font-size:14px;color:#8A8174;">⌂</div>
          <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#8A8174;">Delivered</p>
        </td>
      </tr>
    </table>`
      : "";

  const bodyHtml = `
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;padding:18px 28px;background:${theme.badgeBg};border:1px solid ${theme.badgeBorder};">
        <p style="margin:0 0 6px;font-size:22px;line-height:1;color:${theme.accent};">${theme.icon}</p>
        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${theme.accent};font-weight:600;">
          ${theme.label}
        </p>
      </div>
    </div>

    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${theme.accent};">
      ${theme.eyebrow}
    </p>
    <h1 style="margin:0 0 14px;font-size:26px;font-weight:400;color:#1C1610;">
      ${theme.title}
    </h1>
    <p style="margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:300;line-height:1.75;color:#5C5348;">
      ${theme.message(customer_name, order_id)}
    </p>

    ${shippedTrack}

    <p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:300;line-height:1.7;color:#8A8174;">
      ${theme.note}
    </p>

    ${
      products.length
        ? `<p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8A8174;">
      Your pieces
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
      ${productRows(products, orderCurrency)}
    </table>`
        : ""
    }

    ${contactBlock}
  `;

  return brandEmailShell({
    title: `Order ${theme.label} — ${order_id}`,
    preview: theme.preview,
    bodyHtml,
  });
};
