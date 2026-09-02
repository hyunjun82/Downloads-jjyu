import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon3D, IconDown, IconWarn } from '../../../../components/Icons';
import { SOFTWARE, getSw, getSwCategory, SW_ICON } from '../../../../lib/software';

// 프로그램용 중간 페이지. 서식의 /go/ 와 같은 이유로 둔다.
// 애드센스 전면광고는 '같은 사이트' 페이지를 새 탭으로 열 때 뜬다.
// 상세에서 곧장 제작사 사이트로 나가면 외부 도메인이라 광고가 낄 자리가 없다.
// 서식과 경로를 나눈 이유는 하나다. /go/[cat] 과 슬러그가 겹치면 라우트가 충돌한다.

export function generateStaticParams() {
  return SOFTWARE.map((s) => ({ cat: s.cat, slug: s.slug }));
}

export function generateMetadata({ params }) {
  const s = getSw(params.cat, params.slug);
  if (!s) return {};
  return {
    title: `${s.name} 내려받기`,
    robots: { index: false, follow: true },
    alternates: { canonical: `/software/${s.cat}/${s.slug}/` },
  };
}

export default function SwGo({ params }) {
  const s = getSw(params.cat, params.slug);
  if (!s) notFound();
  const c = getSwCategory(s.cat);

  return (
    <div className="wrap" style={{ padding: '44px 0 60px' }}>
      <div className="golay">
        <div className="gocard">
          <span className="goci" style={{ background: c.bg }}>
            <Icon3D id={SW_ICON[c.slug] || 'i-tool'} />
          </span>
          <h1>{s.name}</h1>
          <div className="srcline" style={{ justifyContent: 'center' }}>
            <span className="badge k">{s.license}</span>
            {s.version && <span className="badge">v{s.version}</span>}
            <span className="badge">{s.vendor}</span>
          </div>

          <div className="fname" style={{ marginTop: 18 }}>
            <span className="ext">공식</span>{s.vendor} 배포 페이지
          </div>

          <a className="dlbtn" href={s.officialUrl} target="_blank" rel="noopener nofollow">
            <IconDown />{s.vendor} 공식 배포처로 이동
          </a>

          <p className="dlnote" style={{ borderTop: 'none', marginTop: 14, paddingTop: 0 }}>
            파일은 저희가 보관하지 않습니다. 제작사 페이지가 새 창으로 열립니다.
          </p>
        </div>

        <div className="ad">광고 영역</div>

        <div className="art" style={{ maxWidth: 640, margin: '0 auto' }}>
          {s.bundle === true && (
            <div className="note">
              <span className="ni"><IconWarn /></span>
              <p>
                이 프로그램은 설치 도중 <b>다른 프로그램을 함께 설치하겠냐고 묻습니다.</b>
                {' '}필요 없으면 그 화면에서 체크를 풀고 넘어가세요.
              </p>
            </div>
          )}
          {s.note && s.bundle !== true && (
            <div className="note">
              <span className="ni"><IconWarn /></span>
              <p>{s.note}</p>
            </div>
          )}
          <p style={{ textAlign: 'center', marginBottom: 0 }}>
            <Link href={`/software/${s.cat}/${s.slug}/`}>← {s.name} 설명 다시 보기</Link>
            {'  ·  '}
            <Link href={`/software/${c.slug}/`}>{c.name} 더 보기</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
