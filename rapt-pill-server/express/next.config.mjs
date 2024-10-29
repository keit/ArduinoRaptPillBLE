// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
// next.config.js

export default {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true, // true for a 301 permanent redirect, or false for 302 temporary
      },
    ];
  },
};
