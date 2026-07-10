/** @type {import('next').NextConfig} */
function r2RemotePatterns() {
  const patterns = [
    // Cloudflare R2 public bucket URLs (r2.dev)
    { protocol: "https", hostname: "**.r2.dev", pathname: "/**" },
  ];

  const publicUrl = process.env.R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (publicUrl) {
    try {
      const { protocol, hostname } = new URL(publicUrl);
      if (hostname && !hostname.endsWith(".r2.dev")) {
        patterns.push({
          protocol: protocol.replace(":", "") || "https",
          hostname,
          pathname: "/**",
        });
      }
    } catch {
      // ignore invalid URL
    }
  }

  return patterns;
}

const nextConfig = {
  images: {
    remotePatterns: [
      ...r2RemotePatterns(),
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

module.exports = nextConfig;
