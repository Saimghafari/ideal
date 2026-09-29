import { SITE_URL } from "@/lib/siteMeta";

export const metadata = {
  title: "My Profile – Manage Your Account | Super Ideal",
  description:
    "Update your Super Ideal profile and account details.",
  keywords:
    "super ideal, profile, account settings, sweets orders, bakery orders",
  viewport: "width=device-width, initial-scale=1.0",
  robots: "noindex, follow",
  alternates: {
    canonical: `${SITE_URL}/profile`,
  },
};

export default function ProfileLayout({ children }) {
  return children;
}
