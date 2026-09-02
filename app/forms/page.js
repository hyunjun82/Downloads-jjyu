import Link from 'next/link';
import Crumb from '../../components/Crumb';
import { IconFile } from '../../components/Icons';
import { CATEGORIES, FORMS, countByCategory, SITE_URL } from '../../lib/forms';

export const metadata = {
  title: '서류·양식 모음',
  description:
    '법률·근로·부동산·가사·세금·금전 여섯 분류로 나눈 서식 모음입니다. 발행 기관과 파일 형식, 마지막 확인 날짜를 함께 적었습니다.',
  alternates: { canonical: '/forms/' },
};

export default function FormsHub() {
  const counts = countByCategory();
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: '서류·양식', item: `${SITE_URL}/forms/` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="top">
        <div className="wrap">
          <Crumb items={[{ name: '홈', href: '/' }, { name: '서류·양식' }]} />
          <h1>서류·양식<span className="cnt num">{FORMS.length}건</span></h1>
          <p className="lead">
            대한법률구조공단·법무부처럼 서식을 배포하는 기관의 원본으로 연결합니다. 어떤 칸에 무엇을
            적는지, 내기 전에 무엇을 확인해야 하는지까지 함께 정리했습니다.
          </p>
        </div>
      </div>

      <div className="wrap sec">
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
        <div className="ad">광고 영역</div>
      </div>
    </>
  );
}
