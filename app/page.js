import Link from 'next/link';
import HomeSearch from '../components/HomeSearch';
import { Icon3D, IconSearch } from '../components/Icons';
import { CATEGORIES, FORMS, countByCategory } from '../lib/forms';

export const metadata = {
  title: '서류 양식·프로그램 무료 다운로드',
  description:
    '고소장·근로계약서 같은 공공기관 서식부터 프로그램·드라이버·폰트까지. 어느 기관이 배포하는지, 어떻게 쓰는지까지 정리했습니다. 파일은 보관하지 않고 공식 배포처로 연결합니다.',
  alternates: { canonical: '/' },
};

// 대분류. 아직 안 연 것은 건수를 지어내지 않고 "준비 중"으로 둔다.
// 지난번에 임의로 적은 숫자(유틸 211·비디오 133)가 실제와 달라 그대로 나갈 뻔했다.
const SECTIONS = [
  { id: 'i-doc',     name: '서류·양식',     href: '/forms/', bg: 'linear-gradient(160deg,#EDF4FF,#DCE8FD)', fg: '#1E5FE0', ready: true },
  { id: 'i-tool',    name: '유틸리티',      bg: 'linear-gradient(160deg,#EAF8F6,#D2EFEA)', fg: '#0D8F84' },
  { id: 'i-media',   name: '비디오·오디오', bg: 'linear-gradient(160deg,#FFF0F3,#FEE0E7)', fg: '#D02E52' },
  { id: 'i-printer', name: '드라이버',      bg: 'linear-gradient(160deg,#ECFBF4,#D8F5E8)', fg: '#0C8F5F' },
  { id: 'i-font',    name: '폰트',          bg: 'linear-gradient(160deg,#FFF7E8,#FDECCF)', fg: '#C1780C' },
  { id: 'i-game',    name: '게임',          bg: 'linear-gradient(160deg,#FEF0FA,#FBDEF3)', fg: '#A3229E' },
  { id: 'i-ai',      name: 'AI 도구',       bg: 'linear-gradient(160deg,#FFF4EA,#FEE6D2)', fg: '#E8631A' },
];

export default function Home() {
  const counts = countByCategory();
  const index = FORMS.map((f) => ({
    h: `/forms/${f.cat}/${f.slug}/`,
    n: f.title,
    t: f.ext,
    c: CATEGORIES.find((c) => c.slug === f.cat)?.name || '',
  }));
  const examples = FORMS.filter((f) => f.hasExample);

  return (
    <>
      <div className="hero">
        <span className="pill">
          <IconSearch />공공기관 원본 · 공식 배포처 연결
        </span>
        <h1>서류 양식 · 프로그램<br />무료 다운로드</h1>
        <p className="hsub">
          고소장·근로계약서 같은 공공기관 서식부터 프로그램·드라이버·폰트까지, 어디서 받는지와
          어떻게 쓰는지를 함께 정리했습니다.
        </p>
        <HomeSearch items={index} />
        <div className="qk">
          {FORMS.slice(0, 5).map((f) => (
            <Link key={f.slug} href={`/forms/${f.cat}/${f.slug}/`}>{f.title}</Link>
          ))}
        </div>
      </div>

      {/* 카테고리 — 분류색은 여기서만 쓴다. 목록·상세로 들어가면 파랑 하나로 통일한다. */}
      <div className="band">
        <div className="wrap sec">
          <div className="sechd"><h2>카테고리별 다운로드</h2></div>
          <div className="cats">
            {SECTIONS.map((s) =>
              s.ready ? (
                <Link className="cat" key={s.id} href={s.href}>
                  <span className="ci" style={{ background: s.bg }}><Icon3D id={s.id} /></span>
                  <span className="nm">{s.name}</span>
                  <span className="ct num" style={{ color: s.fg }}>{FORMS.length}개 서식</span>
                </Link>
              ) : (
                <span className="cat" key={s.id} style={{ opacity: 0.55 }}>
                  <span className="ci" style={{ background: s.bg }}><Icon3D id={s.id} /></span>
                  <span className="nm">{s.name}</span>
                  <span className="ct">준비 중</span>
                </span>
              )
            )}
          </div>
        </div>
      </div>

      <div className="wrap sec">
        <div className="sechd">
          <h2>지금 많이 찾는 것</h2>
        </div>
        <div className="chips">
          {FORMS.slice(0, 8).map((f) => (
            <Link className="chip" key={f.slug} href={`/forms/${f.cat}/${f.slug}/`}>
              <span className="ci" style={{ background: 'linear-gradient(160deg,#EDF4FF,#DCE8FD)' }}>
                <Icon3D id="i-doc" />
              </span>
              {f.title}
            </Link>
          ))}
        </div>
      </div>

      {examples.length > 0 && (
        <div className="band">
          <div className="wrap sec">
            <div className="sechd">
              <h2>작성 예시가 있는 서식</h2>
              <span className="c">칸을 채운 모습을 그대로 보여드립니다</span>
            </div>
            <div className="docs">
              {examples.map((f) => (
                <Link className="dcard" key={f.slug} href={`/forms/${f.cat}/${f.slug}/`}>
                  <span className="ci"><Icon3D id="i-doc" /></span>
                  <span className="nm">{f.title}</span>
                  <span className="sr">{f.ext}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="wrap">
        <div className="ad">광고 영역</div>
      </div>
    </>
  );
}
