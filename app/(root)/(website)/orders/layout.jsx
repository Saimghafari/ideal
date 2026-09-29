import { SITE_URL } from "@/lib/siteMeta";

export const metadata = {
  title: "My Orders | Super Ideal",
  description:
    "View and track your Super Ideal sweets and bakery orders.",
  keywords:
    "super ideal, order history, track orders, sweets orders, bakery orders",
  viewport: "width=device-width, initial-scale=1.0",
  robots: "noindex, follow",
  alternates: {
    canonical: `${SITE_URL}/orders`,
  },
};

export default function OrdersLayout({ children }) {
  return children;
}
