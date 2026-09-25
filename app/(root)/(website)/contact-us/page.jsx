import React from "react";
import ContactPage from "./ContactPage";
import { buildPageMeta } from "@/lib/buildPageMeta";

export const metadata = buildPageMeta({
  title: "Contact Us",
  description:
    "Contact Velora about clothing sizes, orders, shipping, and returns. We reply within one to two business days.",
  path: "/contact-us",
  keywords: "velora contact, clothing sizes, order help, shipping, customer support",
});

const ContactUsPage = () => <ContactPage />;

export default ContactUsPage;
