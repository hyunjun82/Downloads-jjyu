import Link from 'next/link';
import HomeSearch from '../components/HomeSearch';
import { DocIcon, IconFile } from '../components/Icons';
import { CATEGORIES, FORMS, countByCategory } from '../lib/forms';

export const metadata = {
  title: '다운로드 인덱스 — 서식·프로그램을 공식 배포처에서',
  description:
    '고소장·근로계약서·임대차계약서 같은 서식과 국내에서 많이 쓰는 프로그램을 한곳에 정리했습니다. 파일은 보관하지 않고 발행 기관 페이지로 바로 연결합니다.',
  alternates: { canonical: '/' },
};

export default function Home() {
  const counts = countByCategory();
  const index = FORMS.map((f) => ({
    h: `/forms/${f.cat}/${f.slug}/`,
    n: f.title,
    t: f.ext,
    c: CATEGORIES.find((c) => c.slug === f.cat)?.name || '',
  }));
  const popular = FORMS.filter((f) => f.hasExample).slice(0, 6);

  return (
    <>
      <div className="hero">
        <span className="pill">
          <IconFile w={2} />공식 배포처로 바로 연결합니다
        </span>
        <h1>필요한 서식과 프로그램,<br />여기서 한 번에 찾으세요</h1>
        <p className="hsub">
          어느 기관이 배포하는지, 어떻게 쓰는지까지 정리했습니다. 파일은 저희가 보관하지 않습니다.
        </p>
        <HomeSearch items={index} />
        <div className="qk">
          {popular.slice(0, 5).map((f) => (
            <Link key={f.slug} href={`/forms/${f.cat}/${f.slug}/`}>{f.title}</Link>
          ))}
        </div>
      </div>

      <div className="wrap sec">
        <div className="sechd">
          <h2>서류·양식</h2>
          <span className="c">{FORMS.length}건</span>
          <Link className="more2" href="/forms/">전체 보기</Link>
        </div>
        <div className="cats">
          {CATEGORIES.map((c) => (
            <Link className="cat" key={c.slug} href={`/forms/${c.slug}/`}>
              <span className="ci" style={{ background: c.bg, color: c.fg }}>
                <IconFile w={1.6} />
              </span>
              <span className="nm">{c.name}</span>
              <span className="ct num">{counts[c.slug] || 0}건</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="band">
        <div className="wrap sec">
          <div className="sechd">
            <h2>작성 예시가 있는 서식</h2>
            <span className="c">칸을 채운 모습을 그대로 보여드립니다</span>
          </div>
          <div className="docs">
            {popular.map((f) => (
              <Link className="dcard" key={f.slug} href={`/forms/${f.cat}/${f.slug}/`}>
                <span className="ci"><DocIcon /></span>
                <span className="nm">{f.title}</span>
                <span className="sr">{f.ext}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap sec">
        <div className="sechd">
          <h2>준비 중</h2>
          <span className="c">서식을 먼저 열고 순서대로 넓힙니다</span>
        </div>
        <div className="soon">
          <span><b>유틸리티</b>· 압축·백신·최적화</span>
          <span><b>비디오·오디오</b>· 재생기·변환</span>
          <span><b>드라이버</b>· 프린터·복합기</span>
          <span><b>폰트</b>· 무료 배포 글꼴</span>
        </div>
        <div className="ad">광고 영역</div>
      </div>
    </>
  );
}
