import React from "react";
import ContactPage from "./ContactPage";
import SeoJsonLd from "@/components/Application/Website/SeoJsonLd";
import { buildPageMeta } from "@/lib/buildPageMeta";
import { buildBreadcrumbJsonLd } from "@/lib/jsonLdBuilders";
import { WEBSITE_CONTACT } from "@/routes/WebsiteRoute";

export const metadata = buildPageMeta({
  title: "Contact Us",
  description:
    "Contact Super Ideal Sweets & Bakers in Faisalabad about orders, cakes, catering, and shop visits. We reply within one to two business days.",
  path: "/contact-us",
  keywords: "Super Ideal contact, Faisalabad bakery, cake order, catering enquiry",
});

const ContactUsPage = () => (
  <>
    <SeoJsonLd
      data={buildBreadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Contact", url: WEBSITE_CONTACT },
      ])}
    />
    <ContactPage />
  </>
);

export default ContactUsPage;
