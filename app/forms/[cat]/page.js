import { notFound } from 'next/navigation';
import CategoryView from '../../../components/CategoryView';
import {
  CATEGORIES, getCategory, getFormsByCategory, countByCategory, SITE_URL,
} from '../../../lib/forms';

// 뷰어는 서식 페이지 어디서나 같은 자리에 둔다.
// HWP 가 안 열려서 되돌아가는 사람이 이 사이트에서 가장 많다.
const VIEWERS = [
  { name: '한컴오피스 뷰어', ext: 'HWP', url: 'https://www.hancom.com/board/hoffice_view.do' },
  { name: 'Acrobat Reader', ext: 'PDF', url: 'https://get.adobe.com/kr/reader/' },
  { name: '알PDF', ext: 'PDF', url: 'https://www.altools.co.kr/download/alpdf.aspx' },
];

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ cat: c.slug }));
}

export function generateMetadata({ params }) {
  const c = getCategory(params.cat);
  if (!c) return {};
  const n = getFormsByCategory(c.slug).length;
  return {
    title: `${c.name} 서식 ${n}건`,
    description: `${c.desc} 발행 기관과 파일 형식, 마지막 확인 날짜를 함께 적었습니다.`,
    alternates: { canonical: `/forms/${c.slug}/` },
  };
}

export default function CategoryPage({ params }) {
  const cat = getCategory(params.cat);
  if (!cat) notFound();

  const forms = getFormsByCategory(cat.slug);
  const counts = countByCategory();
  const others = CATEGORIES.filter((c) => c.slug !== cat.slug).map((c) => ({
    slug: c.slug, name: c.name, count: counts[c.slug] || 0,
  }));

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: '서류·양식', item: `${SITE_URL}/forms/` },
      { '@type': 'ListItem', position: 3, name: cat.name, item: `${SITE_URL}/forms/${cat.slug}/` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <CategoryView cat={cat} forms={forms} others={others} viewers={VIEWERS} />
    </>
  );
}
