import GlobalProvider from "@/components/Application/GlobalProvider";
import ToastProvider from "@/components/Application/ToastProvider";
import "./globals.css";
import { DM_Sans, Great_Vibes, Nunito, Playfair_Display } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import {
  SITE_URL,
  SITE_HOST,
  OG_IMAGE,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_TYPE,
  SITE_LOGO,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  BRAND_NAME,
  BRAND_TAGLINE,
  CONTACT_EMAIL,
  MERCHANT,
  PRIMARY_NAV,
  absoluteUrl,
} from "@/lib/siteMeta";
import { buildMerchantReturnPolicy } from "@/lib/merchantSchema";

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-dm",
  preload: true,
});

const playfair = Playfair_Display({
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-playfair",
});

const nunito = Nunito({
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-nunito",
});

const greatVibes = Great_Vibes({
  weight: "400",
  display: "swap",
  subsets: ["latin"],
  variable: "--font-great-vibes",
});

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${BRAND_NAME} – ${BRAND_TAGLINE}`,
    template: `%s | ${BRAND_NAME}`,
  },

  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: BRAND_NAME,
  authors: [{ name: BRAND_NAME, url: SITE_URL }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  category: "shopping",
  classification: "Food & Drink > Bakery",

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  manifest: "/site.webmanifest",

  other: {
    "msapplication-TileColor": "#E45700",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#E45700",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: BRAND_NAME,
    title: `${BRAND_NAME} – ${BRAND_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        secureUrl: OG_IMAGE,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: `${BRAND_NAME} – ${BRAND_TAGLINE}`,
        type: OG_IMAGE_TYPE,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} – ${BRAND_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        alt: `${BRAND_NAME} – ${BRAND_TAGLINE}`,
      },
    ],
    creator: BRAND_NAME,
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  alternates: {
    types: {
      "text/plain": [{ url: "/llms.txt", title: "LLMs.txt" }],
    },
  },

  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
};

function buildJsonLd() {
  const orgId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;
  const storeId = `${SITE_URL}/#store`;
  const navId = `${SITE_URL}/#sitenavigation`;

  const navPages = PRIMARY_NAV.map((item) => ({
    "@type": "WebPage",
    "@id": `${absoluteUrl(item.path)}#webpage`,
    url: absoluteUrl(item.path),
    name: item.name,
    description: item.description,
    isPartOf: { "@id": websiteId },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: BRAND_NAME,
        alternateName: [BRAND_TAGLINE, "Super Ideal Sweets & Bakers"],
        url: `${SITE_URL}/`,
        email: CONTACT_EMAIL,
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          url: SITE_LOGO,
          contentUrl: SITE_LOGO,
          width: 1254,
          height: 1254,
          caption: BRAND_NAME,
        },
        image: OG_IMAGE,
        description: DEFAULT_DESCRIPTION,
        slogan: BRAND_TAGLINE,
        foundingDate: "1969",
        contactPoint: [
          {
            "@type": "ContactPoint",
            email: CONTACT_EMAIL,
            contactType: "customer service",
            availableLanguage: ["English"],
            areaServed: "PK",
          },
        ],
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        // Google site name: preferred brand, then domain as lowercase backup
        // https://developers.google.com/search/docs/appearance/site-names
        url: `${SITE_URL}/`,
        name: BRAND_NAME,
        alternateName: [SITE_HOST],
        description: DEFAULT_DESCRIPTION,
        publisher: { "@id": orgId },
        inLanguage: "en-US",
        hasPart: [{ "@id": navId }, ...navPages.map((p) => ({ "@id": p["@id"] }))],
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/shop?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "ItemList",
        "@id": navId,
        name: `${BRAND_NAME} main navigation`,
        numberOfItems: PRIMARY_NAV.length,
        itemListElement: PRIMARY_NAV.map((item, index) => ({
          "@type": "SiteNavigationElement",
          position: index + 1,
          name: item.name,
          description: item.description,
          url: absoluteUrl(item.path),
        })),
      },
      ...navPages,
      {
        "@type": ["Store", "OnlineStore"],
        "@id": storeId,
        name: `${BRAND_NAME} Store`,
        url: SITE_URL,
        image: OG_IMAGE,
        description: DEFAULT_DESCRIPTION,
        parentOrganization: { "@id": orgId },
        brand: { "@id": orgId },
        priceRange: MERCHANT.priceRange,
        currenciesAccepted: MERCHANT.currency,
        paymentAccepted: MERCHANT.paymentAccepted,
        email: CONTACT_EMAIL,
        areaServed: {
          "@type": "Place",
          name: "Pakistan",
        },
        hasMerchantReturnPolicy: buildMerchantReturnPolicy(),
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingDestination: {
            "@type": "DefinedRegion",
            name: MERCHANT.shippingRegion || "Pakistan",
          },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: {
              "@type": "QuantitativeValue",
              minValue: MERCHANT.handlingMinDays,
              maxValue: MERCHANT.handlingMaxDays,
              unitCode: "DAY",
            },
            transitTime: {
              "@type": "QuantitativeValue",
              minValue: MERCHANT.transitMinDays,
              maxValue: MERCHANT.transitMaxDays,
              unitCode: "DAY",
            },
          },
        },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: `${BRAND_NAME} – ${BRAND_TAGLINE}`,
        isPartOf: { "@id": websiteId },
        about: { "@id": orgId },
        description: DEFAULT_DESCRIPTION,
        inLanguage: "en-US",
        significantLink: PRIMARY_NAV.map((item) => absoluteUrl(item.path)),
      },
    ],
  };
}

export default function RootLayout({ children }) {
  const jsonLd = buildJsonLd();

  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} ${nunito.variable} ${greatVibes.variable}`}
    >
      <head>
        <link
          rel="preload"
          as="image"
          href="/assets/images/mobilehero.webp"
          type="image/webp"
          media="(max-width: 767px)"
        />
        <link
          rel="preload"
          as="image"
          href="/assets/images/meta-image.webp"
          type="image/webp"
          media="(min-width: 768px)"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {/* <GoogleTagManager gtmId="" /> */}
      <body className={`${dmSans.className} antialiased`}>
        <GlobalProvider>
          <ToastProvider />
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}
