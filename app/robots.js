import {
  absoluteUrl,
  getCanonicalSiteUrl,
  ROBOTS_DISALLOW,
} from "@/lib/siteMeta";

/**
 * robots.txt — optimized for Googlebot, Google Merchant discovery,
 * and major AI / answer-engine crawlers.
 *
 * Always uses the production canonical host (never localhost).
 */
export default function robots() {
  const host = getCanonicalSiteUrl();

  const publicRules = {
    allow: "/",
    disallow: ROBOTS_DISALLOW,
  };

  return {
    rules: [
      // Default — Googlebot, Google-InspectionTool, AdsBot follow * unless overridden
      {
        userAgent: "*",
        ...publicRules,
      },
      // Explicit Google search crawlers
      {
        userAgent: "Googlebot",
        ...publicRules,
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: ROBOTS_DISALLOW,
      },
      // Merchant Center / Shopping product crawl
      {
        userAgent: "Googlebot-News",
        ...publicRules,
      },
      {
        userAgent: "Storebot-Google",
        ...publicRules,
      },
      {
        userAgent: "AdsBot-Google",
        ...publicRules,
      },
      // Google Gemini training corpus (does not affect Search indexing)
      {
        userAgent: "Google-Extended",
        ...publicRules,
      },
      // OpenAI
      { userAgent: "GPTBot", ...publicRules },
      { userAgent: "OAI-SearchBot", ...publicRules },
      { userAgent: "ChatGPT-User", ...publicRules },
      // Anthropic
      { userAgent: "ClaudeBot", ...publicRules },
      { userAgent: "Claude-SearchBot", ...publicRules },
      { userAgent: "Claude-User", ...publicRules },
      { userAgent: "anthropic-ai", ...publicRules },
      // Perplexity
      { userAgent: "PerplexityBot", ...publicRules },
      { userAgent: "Perplexity-User", ...publicRules },
      // Others used in AI answers / discovery
      { userAgent: "Applebot-Extended", ...publicRules },
      { userAgent: "Bingbot", ...publicRules },
      { userAgent: "Amazonbot", ...publicRules },
      { userAgent: "Bytespider", ...publicRules },
      { userAgent: "CCBot", ...publicRules },
      { userAgent: "cohere-ai", ...publicRules },
      { userAgent: "meta-externalagent", ...publicRules },
      { userAgent: "FacebookBot", ...publicRules },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host,
  };
}
