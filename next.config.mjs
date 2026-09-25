/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep Open Graph / meta description in <head> for every client.
  // Next 15 streams metadata into <body> by default — WhatsApp, iMessage,
  // and many preview tools only read <head>, so descriptions never appeared
  // on shop / contact / FAQ / policy pages (homepage looked fine by luck).
  htmlLimitedBots: /.*/,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "engine.com.pk",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/embroidered-wall-art",
        destination: "/shop",
        permanent: false,
      },
      {
        source: "/embroidered-wall-art/:path*",
        destination: "/shop/:path*",
        permanent: false,
      },
      {
        source: "/botanical-embroidery-wall-art",
        destination: "/shop?category=women",
        permanent: false,
      },
      {
        source: "/wildlife-embroidery-wall-art",
        destination: "/shop?category=men",
        permanent: false,
      },
      {
        source: "/modern-embroidery-wall-art",
        destination: "/shop?category=accessories",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Apply to all routes on dectorre.com / www.dectorre.com
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": new URL(".", import.meta.url).pathname,
    };
    return config;
  },
};

export default nextConfig;
