/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zavxbzloccalzprhjzkt.supabase.co",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
