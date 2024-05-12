/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com", // 이 host url의 이미지를 최적화하고싶다
      },
    ],
  },
};

export default nextConfig;
