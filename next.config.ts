import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Match the legacy WordPress URLs, which all end in a trailing slash.
  // Preserves SEO and keeps existing inbound links resolving without redirects.
  trailingSlash: true,
};

export default nextConfig;
