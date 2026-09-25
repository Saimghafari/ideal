import { SITE_URL } from "@/lib/siteMeta";

export const metadata = {
  title: "Bag",
  description: "Review clothing in your Velora bag. Prices in Pakistani rupees.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/cart` },
};

export default function CartLayout({ children }) {
  return children;
}
