import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The previous deployment was static HTML — keep old links alive.
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/apply.html", destination: "/apply", permanent: true },
      { source: "/learn.html", destination: "/learn", permanent: true },
      { source: "/course.html", destination: "/course", permanent: true },
    ];
  },
};

export default nextConfig;
