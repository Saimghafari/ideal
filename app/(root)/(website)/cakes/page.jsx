import { Suspense } from "react";
import CakesClient from "./CakesClient";
import SeoJsonLd from "@/components/Application/Website/SeoJsonLd";
import { buildPageMeta } from "@/lib/buildPageMeta";
import { buildBreadcrumbJsonLd } from "@/lib/jsonLdBuilders";
import { WEBSITE_CAKES } from "@/routes/WebsiteRoute";

const TITLE = "Cakes";
const DESCRIPTION =
  "Celebration cakes from Super Ideal Sweets & Bakers. Browse chocolate, fruit cream, and every other cake style on the counter.";

export const metadata = buildPageMeta({
  title: TITLE,
  description: DESCRIPTION,
  path: WEBSITE_CAKES,
  keywords: "Super Ideal cakes, chocolate cake, fruit cream cake, celebration cakes, Faisalabad",
});

export default function CakesPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Cakes", url: WEBSITE_CAKES },
  ]);

  return (
    <div className="min-h-[70vh] bg-[#FFF8F2]">
      <SeoJsonLd data={breadcrumbJsonLd} />
      <Suspense fallback={null}>
        <CakesClient />
      </Suspense>
    </div>
  );
}
