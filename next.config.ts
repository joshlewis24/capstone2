/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/partners/:path*",
        destination: "http://192.168.254.54:8085/api/partners/:path*",
      },
    ];
  },
};

module.exports = nextConfig;