import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { DocSprite } from '../components/Icons';
import { SITE_URL, SITE_NAME } from '../lib/forms';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '다운로드 인덱스 — 서식·프로그램을 공식 배포처에서',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    '법률·근로·부동산 서식과 국내에서 많이 쓰는 프로그램을 한곳에 정리했습니다. 파일은 보관하지 않고 발행 기관과 제작사 페이지로 바로 연결합니다.',
  applicationName: SITE_NAME,
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'ko_KR',
    url: SITE_URL,
  },
};

export const viewport = { width: 'device-width', initialScale: 1 };

// 사이트 전체 정보. 페이지마다 반복하지 않고 여기 한 번만 둔다.
const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      inLanguage: 'ko-KR',
      publisher: { '@id': `${SITE_URL}/#org` },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#org`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fundingchoicesmessages.google.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />

        {/* Offerwall 선로드 — 애드센스 뒤에 붙이면 표시가 2초 넘게 밀린다(퀴즈에서 실측). */}
        <script async src="https://fundingchoicesmessages.google.com/i/ca-pub-2442517902625121?ers=1" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){function s(){if(!window.frames['googlefcPresent']){if(document.body){var i=document.createElement('iframe');i.style='width:0;height:0;border:none;z-index:-1000;left:-1000px;top:-1000px;';i.style.display='none';i.name='googlefcPresent';document.body.appendChild(i);}else{setTimeout(s,0);}}}s();})();",
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2442517902625121"
          crossOrigin="anonymous"
        />

        {/* 폰트는 link 로 직접 걸지 않고 스크립트로 붙인다 — 퀴즈와 같은 방식.
            head 의 stylesheet 는 렌더를 막는다. 광고 스크립트와 같이 걸리면 첫 화면이 그만큼 늦어진다.
            명조체는 작성 예시 문서에서만 쓰므로 더더욱 본문을 막을 이유가 없다. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var f=['https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css','https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&display=swap'];for(var i=0;i<f.length;i++){var l=document.createElement('link');l.rel='stylesheet';l.href=f[i];document.head.appendChild(l);}})();",
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&display=swap"
          />
        </noscript>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />
      </head>
      <body>
        <DocSprite />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
