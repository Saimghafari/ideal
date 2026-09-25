import {
  SITE_URL,
  OG_IMAGE,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_TYPE,
  BRAND_NAME,
} from "@/lib/siteMeta";
import { brandTitle, socialDescriptionFields } from "@/lib/ogMeta";

export function buildPageMeta({
  title,
  description,
  path,
  keywords,
  ogTitle,
}) {
  const canonical = `${SITE_URL}${path}`;
  const pageTitle = brandTitle(title);
  const socialTitle = ogTitle ? brandTitle(ogTitle) : pageTitle;
  const { description: metaDescription, otherDescription } =
    socialDescriptionFields(description);

  return {
    title: { absolute: pageTitle },
    description: metaDescription,
    keywords,
    robots: { index: true, follow: true },
    metadataBase: new URL(SITE_URL),
    alternates: { canonical },
    openGraph: {
      title: socialTitle,
      description: metaDescription,
      url: canonical,
      siteName: BRAND_NAME,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: OG_IMAGE,
          secureUrl: OG_IMAGE,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          type: OG_IMAGE_TYPE,
          alt: `${title} - ${BRAND_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: metaDescription,
      images: [
        {
          url: OG_IMAGE,
          alt: `${title} - ${BRAND_NAME}`,
        },
      ],
    },
    other: {
      ...otherDescription,
    },
  };
}
