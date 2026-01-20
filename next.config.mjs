/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: false, // nếu liên quan
  },
  images: {
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "picsum.photos",
      "images.pexels.com",
    ],
  },
};

export default nextConfig;
