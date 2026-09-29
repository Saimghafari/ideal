import { SITE_URL } from "@/lib/siteMeta";

export const metadata = {
  title: "Checkout",
  description: "Complete your Super Ideal sweets and bakery order. Prices in Pakistani rupees.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/checkout` },
};

export default function CheckoutLayout({ children }) {
  return children;
};
