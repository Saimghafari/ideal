import { SITE_URL } from "@/lib/siteMeta";

export const metadata = {
  title: "My Account | Super Ideal Sweets & Bakers",
  description:
    "Your Super Ideal account — sweets, bakery orders, and the treats in your bag.",
  keywords:
    "super ideal, my account, sweets orders, bakery orders, account dashboard",
  viewport: "width=device-width, initial-scale=1.0",
  robots: "noindex, follow",
  alternates: {
    canonical: `${SITE_URL}/my-account`,
  },
};

export default function MyAccountLayout({ children }) {
  return children;
}
