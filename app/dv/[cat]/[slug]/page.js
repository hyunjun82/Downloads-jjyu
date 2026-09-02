import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon3D, IconDown, IconWarn } from '../../../../components/Icons';
import { DRIVERS, getDriver, getDvCategory } from '../../../../lib/drivers';

// 드라이버용 중간 페이지. /go/(서식) · /sw/(프로그램) 와 같은 이유로 둔다.
export function generateStaticParams() {
  return DRIVERS.map((d) => ({ cat: d.cat, slug: d.slug }));
}

export function generateMetadata({ params }) {
  const d = getDriver(params.cat, params.slug);
  if (!d) return {};
  return {
    title: `${d.title} 내려받기`,
    robots: { index: false, follow: true },
    alternates: { canonical: `/drivers/${d.cat}/${d.slug}/` },
  };
}

export default function DvGo({ params }) {
  const d = getDriver(params.cat, params.slug);
  if (!d) notFound();
  const c = getDvCategory(d.cat);
  const main = d.files.find((f) => f.main) || d.files[0];

  return (
    <div className="wrap" style={{ padding: '44px 0 60px' }}>
      <div className="golay">
        <div className="gocard">
          <span className="goci" style={{ background: c.bg }}><Icon3D id="i-printer" /></span>
          <h1>{d.title}</h1>
          <div className="srcline" style={{ justifyContent: 'center' }}>
            <span className="badge k">{d.files.length}개 파일</span>
            <span className="badge">{d.maker}</span>
            <span className="badge">{d.host} 배포</span>
          </div>

          <div className="fname" style={{ marginTop: 18 }}>
            <span className="ext">이것부터</span>{d.pickFirst}
          </div>

          <a className="dlbtn" href={d.page} target="_blank" rel="noopener nofollow">
            <IconDown />{d.host} 공식 지원 페이지로 이동
          </a>

          <p className="dlnote" style={{ borderTop: 'none', marginTop: 14, paddingTop: 0 }}>
            파일은 저희가 보관하지 않습니다. {d.host} 페이지가 새 창으로 열립니다.
          </p>
        </div>

        <div className="ad">광고 영역</div>

        <div className="art" style={{ maxWidth: 640, margin: '0 auto' }}>
          <div className="note">
            <span className="ni"><IconWarn /></span>
            <p>
              열리는 페이지에 파일이 <b>{d.files.length}개</b> 있습니다. 그중{' '}
              <b>{d.pickFirst}</b>({main.size}) 를 고르세요. 나머지는 무선 설정·관리·진단용이라
              지금은 필요 없습니다.
            </p>
          </div>
          <p style={{ textAlign: 'center', marginBottom: 0 }}>
            <Link href={`/drivers/${d.cat}/${d.slug}/`}>← {d.title} 설명 다시 보기</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
