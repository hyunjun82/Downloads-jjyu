/** @type {import('next').NextConfig} */
const nextConfig = {
  // 정적 내보내기 : Cloudflare Pages 에 out/ 을 그대로 올린다. 퀴즈·게임과 같은 방식.
  // 로컬 미리보기(.claude/launch.json)에서만 NEXT_PREVIEW=1 로 끈다.
  // export 모드의 dev 서버는 한글 경로(퍼센트 인코딩)를 generateStaticParams 와 대조하다 500 을 낸다.
  // 배포 빌드에는 이 변수가 없으므로 그대로 export 다.
  output: process.env.NEXT_PREVIEW ? undefined : 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
