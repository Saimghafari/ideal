import { SITE_URL } from "@/lib/siteMeta";

export const metadata = {
  title: "Cart",
  description: "Review sweets, bakery, and gift boxes in your Super Ideal cart. Prices in Pakistani rupees.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/cart` },
};

export default function CartLayout({ children }) {
  return children;
}
