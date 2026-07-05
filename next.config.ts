import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Consume the local design system, which ships raw TypeScript source.
  transpilePackages: ["@meniva/design-system"],
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "ctrlplane.vercel.app" }],
        destination: "https://ctrplane.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    if (process.env.VERCEL_ENV !== "preview") return [];

    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
