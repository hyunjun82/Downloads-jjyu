/** @type {import('next').NextConfig} */
const nextConfig = {
  // 정적 내보내기 : Cloudflare Pages 에 out/ 을 그대로 올린다. 퀴즈·게임과 같은 방식.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
