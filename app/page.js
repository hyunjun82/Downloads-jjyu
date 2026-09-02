import Link from 'next/link';
import HomeSearch from '../components/HomeSearch';
import { Icon3D, IconSearch, IconDown, IconShield, IconCal, IconNo } from '../components/Icons';
import { CATEGORIES, FORMS, countByCategory } from '../lib/forms';
import { SOFTWARE, SW_CATEGORIES, getSwByCategory, getSwBySlug, SW_ICON } from '../lib/software';
import { DRIVERS } from '../lib/drivers';

export const metadata = {
  title: '서류 양식·프로그램 무료 다운로드',
  description:
    '고소장·근로계약서 같은 공공기관 서식부터 크롬·곰플레이어 같은 프로그램까지. 어디서 받는지와 어떻게 쓰는지를 정리했습니다. 파일은 보관하지 않고 공식 배포처로 연결합니다.',
  alternates: { canonical: '/' },
};

// 카테고리 카드. 어제 시안(index_1.html)의 7칸을 그대로 두되,
// 건수는 시안의 예시 숫자(267·211·133…) 대신 실제 데이터 개수를 쓴다.
const SECTIONS = [
  { id: 'i-doc',     name: '서류·양식',     href: '/forms/',            unit: '개 서식',    n: () => FORMS.length,                     bg: 'linear-gradient(160deg,#EDF4FF,#DCE8FD)', fg: '#1E5FE0' },
  { id: 'i-tool',    name: '유틸리티',      href: '/software/',         unit: '개 프로그램', n: () => SOFTWARE.length,                  bg: 'linear-gradient(160deg,#EAF8F6,#D2EFEA)', fg: '#0D8F84' },
  { id: 'i-media',   name: '비디오·오디오', href: '/software/media/',   unit: '개 프로그램', n: () => getSwByCategory('media').length,  bg: 'linear-gradient(160deg,#FFF0F3,#FEE0E7)', fg: '#D02E52' },
  { id: 'i-web',     name: '브라우저',      href: '/software/browser/', unit: '개 프로그램', n: () => getSwByCategory('browser').length, bg: 'linear-gradient(160deg,#EDF4FF,#DCE8FD)', fg: '#1668D6' },
  { id: 'i-printer', name: '드라이버',      href: '/drivers/',          unit: '개 모델',    n: () => DRIVERS.length,                   bg: 'linear-gradient(160deg,#ECFBF4,#D8F5E8)', fg: '#0C8F5F' },
  { id: 'i-font',    name: '폰트',          bg: 'linear-gradient(160deg,#FFF7E8,#FDECCF)', fg: '#C1780C' },
  { id: 'i-game',    name: '게임',          bg: 'linear-gradient(160deg,#FEF0FA,#FBDEF3)', fg: '#A3229E' },
];

// 인기 프로그램 카드에 얼굴로 세울 여섯 개. 어제 시안에 로고가 들어 있던 것들이다.
const APPS = ['곰플레이어', '알집', 'v3라이트', '크롬', '네이버웨일', '한글뷰어'];

// 프로그램 카드 하나. 로고가 있으면 로고를, 없으면 분류 아이콘을 쓴다.
function AppCard({ s }) {
  const c = SW_CATEGORIES.find((x) => x.slug === s.cat);
  return (
    <Link className="app" href={`/software/${s.cat}/${s.slug}/`}>
      <span className="sq">
        {s.logo
          ? <img src={`/logo/${s.logo}.avif`} alt="" width="128" height="128" />
          : <Icon3D id={SW_ICON[s.cat] || 'i-tool'} />}
      </span>
      <span className="nm">{s.name}</span>
      <span className="mt">{s.license}{s.version ? ` · v${s.version}` : ''}</span>
    </Link>
  );
}

export default function Home() {
  const counts = countByCategory();
  const index = [
    ...FORMS.map((f) => ({
      h: `/forms/${f.cat}/${f.slug}/`, n: f.title, t: f.ext,
      c: CATEGORIES.find((c) => c.slug === f.cat)?.name || '',
    })),
    // 검색창에서 '크롬'을 쳐도 나오게 한다. 지금까지 서식만 들어 있었다.
    ...SOFTWARE.map((s) => ({
      h: `/software/${s.cat}/${s.slug}/`, n: s.name, t: s.license,
      c: SW_CATEGORIES.find((c) => c.slug === s.cat)?.name || '',
    })),
  ];
  const apps = APPS.map(getSwBySlug).filter(Boolean);
  const legal = FORMS.filter((f) => f.cat === 'legal').slice(0, 6);

  // 자주 찾는 파일 — 서식과 프로그램을 섞는다.
  // 시안은 「이번 주 많이 받은 파일」이었지만 우리는 실제 내려받기 수를 모른다.
  // 지어낸 순위를 적느니 제목을 바꿨다. 애널리틱스를 붙이면 진짜 숫자로 갈아 끼운다.
  const picks = [
    { t: '고소장', m: '대한법률구조공단', h: '/forms/legal/고소장/', doc: true },
    { t: '구글 크롬', m: '무료', h: '/software/browser/크롬/', logo: 'chrome' },
    { t: '한컴오피스 뷰어', m: '무료(개인)', h: '/software/office/한글뷰어/', logo: 'hancom' },
    { t: '곰플레이어', m: '무료', h: '/software/media/곰플레이어/', logo: 'gomplayer' },
    { t: '고발장', m: '대한법률구조공단', h: '/forms/legal/고발장/', doc: true },
    { t: '알집', m: '무료(개인)', h: '/software/archive/알집/', logo: 'alzip' },
    { t: '네이버 웨일', m: '무료', h: '/software/browser/네이버웨일/', logo: 'whale' },
  ];

  return (
    <>
      <div className="hero">
        <span className="pill">
          <IconSearch />공공기관 원본 · 공식 배포처 연결
        </span>
        <h1>서류 양식 · 프로그램<br />무료 다운로드</h1>
        <p className="hsub">
          고소장·근로계약서 같은 공공기관 서식부터 크롬·곰플레이어 같은 프로그램까지{' '}
          {FORMS.length + SOFTWARE.length}건을 한 자리에서 받으세요.
        </p>
        <HomeSearch items={index} />
        <div className="qk">
          <Link href="/forms/legal/고소장/">고소장</Link>
          <Link href="/software/browser/크롬/">크롬</Link>
          <Link href="/software/media/곰플레이어/">곰플레이어</Link>
          <Link href="/software/archive/알집/">알집</Link>
          <Link href="/software/office/한글뷰어/">한글뷰어</Link>
        </div>
      </div>

      {/* 카테고리 — 분류색은 여기서만 쓴다. 목록·상세로 들어가면 파랑 하나로 통일한다. */}
      <div className="band">
        <div className="wrap sec">
          <div className="sechd"><h2>카테고리별 다운로드</h2></div>
          <div className="cats">
            {SECTIONS.map((s) =>
              s.href ? (
                <Link className="cat" key={s.id} href={s.href}>
                  <span className="ci" style={{ background: s.bg }}><Icon3D id={s.id} /></span>
                  <span className="nm">{s.name}</span>
                  <span className="ct num" style={{ color: s.fg }}>{s.n()}{s.unit}</span>
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

      {/* 지금 많이 찾는 것 */}
      <div className="wrap sec">
        <div className="sechd"><h2>지금 많이 찾는 것</h2></div>
        <div className="chips">
          <Link className="chip" href="/forms/legal/고소장/">
            <span className="ci" style={{ background: 'linear-gradient(160deg,#EDF4FF,#DCE8FD)' }}><Icon3D id="i-doc" /></span>
            고소장 작성 방법
          </Link>
          <Link className="chip" href="/software/browser/">
            <span className="ci" style={{ background: 'linear-gradient(160deg,#EDF4FF,#DCE8FD)' }}><Icon3D id="i-web" /></span>
            브라우저 내려받기
          </Link>
          <Link className="chip" href="/software/archive/">
            <span className="ci" style={{ background: 'linear-gradient(160deg,#EAF8F6,#D2EFEA)' }}><Icon3D id="i-tool" /></span>
            압축 프로그램
          </Link>
          <Link className="chip" href="/software/media/">
            <span className="ci" style={{ background: 'linear-gradient(160deg,#FFF0F3,#FEE0E7)' }}><Icon3D id="i-media" /></span>
            동영상 재생기
          </Link>
        </div>
      </div>

      {/* 서류 양식 다운로드 — 탭은 분류 목록으로 바로 보낸다.
          자바스크립트 탭으로 만들면 그 안의 내용이 검색엔진에 안 잡힌다. */}
      <div className="band">
        <div className="wrap sec">
          <div className="sechd"><h2>서류 양식 다운로드</h2><span className="c num">{FORMS.length}건</span></div>
          <div className="tabs">
            {CATEGORIES.map((c, i) => (
              <Link className={`tab${i === 0 ? ' on' : ''}`} key={c.slug} href={`/forms/${c.slug}/`}>{c.name}</Link>
            ))}
          </div>
          <div className="docs">
            {legal.map((f) => (
              <Link className="dcard" key={f.slug} href={`/forms/${f.cat}/${f.slug}/`}>
                <span className="ci"><Icon3D id="i-doc" /></span>
                <span className="nm">{f.title}</span>
                <span className="sr">{f.issuer}</span>
              </Link>
            ))}
          </div>
          <Link className="allbtn" href="/forms/">{FORMS.length}건 전체 보기</Link>
        </div>
      </div>

      <div className="wrap"><div className="ad">광고 영역</div></div>

      {/* 인기 프로그램 */}
      <div className="wrap sec" style={{ paddingTop: 6 }}>
        <div className="sechd"><h2>인기 프로그램</h2><span className="c num">{SOFTWARE.length}건</span></div>
        <div className="tabs">
          {SW_CATEGORIES.map((c, i) => (
            <Link className={`tab${i === 0 ? ' on' : ''}`} key={c.slug} href={`/software/${c.slug}/`}>{c.name}</Link>
          ))}
        </div>
        <div className="apps">
          {apps.map((s) => <AppCard key={s.slug} s={s} />)}
        </div>
        <Link className="allbtn" href="/software/">{SOFTWARE.length}건 전체 보기</Link>
      </div>

      {/* 자주 찾는 파일 */}
      <div className="band">
        <div className="wrap sec">
          <div className="sechd">
            <h2>자주 찾는 파일</h2>
            <span className="c">서식과 프로그램을 섞어 정리했습니다</span>
          </div>
          <div className="rank">
            {picks.map((p, i) => (
              <Link className="rw" key={p.h} href={p.h}>
                <span className="no num">{i + 1}</span>
                <span className="th">
                  {p.logo
                    ? <img src={`/logo/${p.logo}.avif`} alt="" width="128" height="128" />
                    : <Icon3D id="i-doc" />}
                </span>
                <span className="nm">{p.t}</span>
                <span className="mt">{p.m}</span>
                <span className="dl"><IconDown /></span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 신뢰 3칸 — 시안의 문구를 그대로 옮겼다. 셋 다 실제로 지키고 있는 것이다. */}
      <div className="wrap sec">
        <div className="trust3">
          <div>
            <span className="ti"><IconShield /></span>
            <b>파일을 다시 올리지 않습니다</b>
            <span>설치 파일은 제조사로, 서식은 발행 기관으로 바로 연결합니다.</span>
          </div>
          <div>
            <span className="ti"><IconCal /></span>
            <b>확인한 날짜를 적습니다</b>
            <span>언제 확인한 정보인지 페이지마다 표시하고, 끊긴 링크는 그날 고칩니다.</span>
          </div>
          <div>
            <span className="ti"><IconNo /></span>
            <b>가짜 다운로드 버튼이 없습니다</b>
            <span>내려받기 버튼은 페이지마다 하나뿐이고, 광고를 버튼처럼 두지 않습니다.</span>
          </div>
        </div>
      </div>

      <div className="wrap"><div className="ad">광고 영역</div></div>
    </>
  );
}
