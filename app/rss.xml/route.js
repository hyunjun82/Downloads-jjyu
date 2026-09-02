import { CATEGORIES, FORMS, SITE_URL, SITE_NAME, plain } from '../../lib/forms';
import { SW_CATEGORIES, SOFTWARE } from '../../lib/software';

// RSS 2.0 피드.
//
// 네이버 서치어드바이저의 「RSS 제출」에 넣을 주소다. 사이트맵은 "어떤 주소가 있는지"만
// 알려 주고, RSS 는 "무엇이 새로 올라왔고 내용이 무엇인지"까지 알려 준다.
// 네이버는 RSS 를 받은 사이트를 더 자주 들여다본다.
//
// 네이버 도움말이 요구하는 세 가지를 지킨다.
//   1) 본문 전체를 넣을 것        → description 에 요약이 아니라 실제 본문 문장을 넣는다
//   2) 모든 URL 이 같은 도메인일 것 → 외부 배포처 링크는 넣지 않는다
//   3) 크기 제한이 있으니 중요한 것만 → 목록 페이지는 빼고 상세 22개만 넣는다
//
// output:'export' 에서도 정적 파일로 떨어지도록 force-static 을 명시한다.
// 사이트맵에서 이걸 빠뜨려 빌드가 통째로 깨진 적이 있다.
export const dynamic = 'force-static';

// 한글 경로는 퍼센트 인코딩한다. 사이트맵과 같은 이유다.
const u = (p) => `${SITE_URL}${p.split('/').map(encodeURIComponent).join('/')}`;

// XML 에서 의미를 갖는 다섯 글자를 막는다. 이걸 안 하면 & 하나로 피드 전체가 깨진다.
const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const rfc822 = (d) => new Date(d).toUTCString();

export function GET() {
  const now = new Date();
  const items = [];

  // 서식 — 소개 문단과 작성 항목을 본문으로 싣는다.
  for (const f of FORMS) {
    const c = CATEGORIES.find((x) => x.slug === f.cat);
    const body = [];
    body.push(f.summary);
    if (f.intro) body.push(...f.intro.map(plain));
    if (f.fields) body.push('작성 항목 — ' + f.fields.map(([k, v]) => `${k}: ${v}`).join(' / '));
    if (f.sourceName) body.push(`원본 : ${f.sourceName}`);
    items.push({
      title: `${f.title} 양식 내려받기와 작성 방법`,
      link: u(`/forms/${f.cat}/${f.slug}/`),
      cat: c ? c.name : '서식',
      date: f.checked ? new Date(f.checked) : now,
      body: body.join('\n\n'),
    });
  }

  // 프로그램 — 세 줄 요약과 장단점을 본문으로 싣는다.
  for (const s of SOFTWARE) {
    const c = SW_CATEGORIES.find((x) => x.slug === s.cat);
    const body = [];
    body.push(s.summary);
    body.push(...s.lead.map(([t, d]) => `${t} ${d}`));
    body.push('장점 — ' + s.pros.join(' / '));
    body.push('단점 — ' + s.cons.join(' / '));
    body.push(
      `개발사 ${s.vendor} · 라이선스 ${s.license}` +
      (s.version ? ` · 버전 ${s.version}` : '') +
      ` · 지원 ${s.os.join(', ')}`
    );
    items.push({
      title: `${s.name} 다운로드 — 공식 배포처와 설치 방법`,
      link: u(`/software/${s.cat}/${s.slug}/`),
      cat: c ? c.name : '프로그램',
      date: now,
      body: body.join('\n\n'),
    });
  }

  const xml =
`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
<title>${esc(SITE_NAME)}</title>
<link>${SITE_URL}/</link>
<description>공공기관 서식과 프로그램을 발행 기관·제작사 공식 배포처로 연결합니다. 파일을 보관하거나 다시 포장하지 않습니다.</description>
<language>ko</language>
<lastBuildDate>${rfc822(now)}</lastBuildDate>
<generator>${esc(SITE_NAME)}</generator>
${items.map((it) => `<item>
<title>${esc(it.title)}</title>
<link>${it.link}</link>
<guid isPermaLink="true">${it.link}</guid>
<category>${esc(it.cat)}</category>
<dc:creator>${esc(SITE_NAME)}</dc:creator>
<pubDate>${rfc822(it.date)}</pubDate>
<description><![CDATA[${it.body.split('\n\n').map((p) => `<p>${p.replace(/\]\]>/g, '')}</p>`).join('\n')}]]></description>
</item>`).join('\n')}
</channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
