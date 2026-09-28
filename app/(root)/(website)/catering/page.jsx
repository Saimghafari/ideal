import { Suspense } from "react";
import CateringClient from "./CateringClient";
import SeoJsonLd from "@/components/Application/Website/SeoJsonLd";
import { buildPageMeta } from "@/lib/buildPageMeta";
import { buildBreadcrumbJsonLd } from "@/lib/jsonLdBuilders";
import { WEBSITE_CATERING } from "@/routes/WebsiteRoute";

const TITLE = "Catering";
const DESCRIPTION =
  "Catering from Super Ideal Sweets & Bakers. Browse every catering menu and its subcategories, from party trays to celebration spreads.";

export const metadata = buildPageMeta({
  title: TITLE,
  description: DESCRIPTION,
  path: WEBSITE_CATERING,
  keywords: "Super Ideal catering, party trays, event catering, Faisalabad",
});

export default function CateringPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Catering", url: WEBSITE_CATERING },
  ]);

  return (
    <div className="min-h-[70vh] bg-[#FFF8F2]">
      <SeoJsonLd data={breadcrumbJsonLd} />
      <Suspense fallback={null}>
        <CateringClient />
      </Suspense>
    </div>
  );
}
