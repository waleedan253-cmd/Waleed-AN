// next.config.js  (or next.config.ts)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ocituxzkarioavkwhzdb.supabase.co", // ← your Supabase project
        port: "",
        pathname: "/storage/v1/object/public/**", // ← all storage files
      },
    ],
  },
};

export default nextConfig;
