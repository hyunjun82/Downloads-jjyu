import Link from 'next/link';
import { notFound } from 'next/navigation';
import Crumb from '../../../components/Crumb';
import { Icon3D } from '../../../components/Icons';
import { DV_CATEGORIES, getDvCategory, getDvByCategory } from '../../../lib/drivers';

export function generateStaticParams() {
  return DV_CATEGORIES.map((c) => ({ cat: c.slug }));
}

export function generateMetadata({ params }) {
  const c = getDvCategory(params.cat);
  if (!c) return {};
  const list = getDvByCategory(c.slug);
  return {
    title: `${c.name} 드라이버 ${list.length}개 모델`,
    description: `${c.desc} ${list.map((d) => d.model).join(', ')} 드라이버를 제조사 공식 지원 페이지로 연결합니다.`,
    alternates: { canonical: `/drivers/${c.slug}/` },
  };
}

export default function DvCategory({ params }) {
  const c = getDvCategory(params.cat);
  if (!c) notFound();
  const list = getDvByCategory(c.slug);
  return (
    <>
      <div className="head">
        <div className="wrap">
          <Crumb items={[{ name: '홈', href: '/' }, { name: '드라이버', href: '/drivers/' }, { name: c.name }]} />
          <h1>{c.name} 드라이버 <span className="num">{list.length}개 모델</span></h1>
          <p>{c.desc}</p>
        </div>
      </div>
      <div className="wrap sec">
        <div className="swlist">
          {list.map((d) => (
            <Link className="swrow" key={d.slug} href={`/drivers/${d.cat}/${d.slug}/`}>
              <span className="ci" style={{ background: c.bg }}><Icon3D id="i-printer" /></span>
              <span className="tx">
                <b>{d.title}</b>
                <em>{d.summary}</em>
                <span className="tags">
                  <span className="badge k">{d.files.length}개 파일</span>
                  <span className="badge">{d.maker}</span>
                  <span className="badge g">{d.host} 공식 배포</span>
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
