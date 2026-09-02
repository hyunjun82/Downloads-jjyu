import Link from 'next/link';
import { notFound } from 'next/navigation';
import Crumb from '../../../components/Crumb';
import { Icon3D } from '../../../components/Icons';
import { SW_CATEGORIES, getSwCategory, getSwByCategory, SW_ICON } from '../../../lib/software';

export function generateStaticParams() {
  return SW_CATEGORIES.map((c) => ({ cat: c.slug }));
}

export function generateMetadata({ params }) {
  const c = getSwCategory(params.cat);
  if (!c) return {};
  const list = getSwByCategory(c.slug);
  return {
    title: `${c.name} 프로그램 ${list.length}개`,
    description: `${c.desc} ${list.map((s) => s.name).join(', ')}를 제작사 공식 배포처로 연결합니다.`,
    alternates: { canonical: `/software/${c.slug}/` },
  };
}

export default function SwCategory({ params }) {
  const c = getSwCategory(params.cat);
  if (!c) notFound();
  const list = getSwByCategory(c.slug);

  return (
    <>
      <div className="head">
        <div className="wrap">
          <Crumb items={[{ name: '홈', href: '/' }, { name: '프로그램', href: '/software/' }, { name: c.name }]} />
          <h1>{c.name} <span className="num">{list.length}개</span></h1>
          <p>{c.desc}</p>
        </div>
      </div>

      <div className="wrap sec">
        <div className="swlist">
          {list.map((s) => (
            <Link className="swrow" key={s.slug} href={`/software/${s.cat}/${s.slug}/`}>
              <span className="ci" style={{ background: c.bg }}><Icon3D id={SW_ICON[c.slug] || 'i-tool'} /></span>
              <span className="tx">
                <b>{s.name}</b>
                <em>{s.summary}</em>
                <span className="tags">
                  <span className="badge k">{s.license}</span>
                  {s.version && <span className="badge">v{s.version}</span>}
                  <span className="badge">{s.vendor}</span>
                  {/* 번들 여부는 사용자가 가장 손해 보는 지점이라 목록에서부터 보여 준다. */}
                  {s.bundle === true && <span className="badge w">설치 시 제휴 프로그램 제안</span>}
                  {s.bundle === false && <span className="badge g">딸려오는 프로그램 없음</span>}
                </span>
              </span>
            </Link>
          ))}
        </div>
        <div className="ad">광고 영역</div>
      </div>
    </>
  );
}
