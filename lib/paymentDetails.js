import { SITE_URL } from "@/lib/siteMeta";

/**
 * Bank-transfer payment details for unpaid order emails.
 * Only Ahtisham (Askari) has a valid scan-to-pay QR.
 */

export const BANK_ACCOUNTS = [
  {
    id: "askari",
    bankName: "Askari Bank",
    country: "PK",
    accountName: "Muhammad Ahtisham",
    iban: "PK87ASCM0002440350008415",
    monogram: "ASK",
    accent: "#1F4E3A",
    logoPath: "/assets/images/banks/askari-logo.png",
    /** Real bank app QR — Ahtisham only */
    qrImagePath: "/assets/images/bank-qr-ahtisham.png",
  },
  {
    id: "ubl",
    bankName: "United Bank Limited",
    country: "PK",
    accountName: "Muhammad Ahmed",
    iban: "PK60UNIL0109000313450844",
    monogram: "UBL",
    accent: "#9B1C1C",
    logoPath: "/assets/images/banks/ubl-logo.png",
  },
  {
    id: "lloyds",
    bankName: "Lloyds Bank",
    country: "GB",
    accountName: "MR Muhammad Aziz",
    accountNumber: "37018360",
    sortCode: "30-92-18",
    monogram: "LLY",
    accent: "#006A4D",
    logoPath: "/assets/images/banks/lloyds-logo.png",
  },
];

/** CID helpers for inline email images */
export function bankQrCid(accountId) {
  return `velora-bank-qr-${accountId}@velora`;
}

export function bankLogoCid(accountId) {
  return `velora-bank-logo-${accountId}@velora`;
}

export function getPaymentDetails() {
  return {
    ready: true,
    method: "Bank Transfer",
    bankAccounts: BANK_ACCOUNTS,
    qrImagePath: `${SITE_URL}/assets/images/bank-qr-ahtisham.png`,
    instructions:
      "Please transfer the order total using any bank account below. Include your Order ID as the payment reference so we can match and verify your payment. Once verified, your order moves to Paid / Processing.",
  };
}

/** @deprecated Prefer getPaymentDetails() */
export const PAYMENT_DETAILS = getPaymentDetails();

/** @deprecated Use bankQrCid(accountId) instead */
export const PAYMENT_QR_CID = "velora-payment-qr@velora";
