import Link from 'next/link';
import Crumb from '../../components/Crumb';
import { Icon3D } from '../../components/Icons';
import { SW_CATEGORIES, SOFTWARE, swCountByCategory, SW_ICON } from '../../lib/software';

export const metadata = {
  title: '프로그램 무료 다운로드',
  description:
    '크롬·곰플레이어·알집처럼 많이 쓰는 프로그램을 제작사 공식 배포처로 연결합니다. 설치할 때 딸려오는 프로그램이 있는지, 무료 범위가 어디까지인지를 먼저 적어 두었습니다.',
  alternates: { canonical: '/software/' },
};

export default function SoftwareIndex() {
  const counts = swCountByCategory();
  return (
    <>
      <div className="head">
        <div className="wrap">
          <Crumb items={[{ name: '홈', href: '/' }, { name: '프로그램' }]} />
          <h1>프로그램 <span className="num">{SOFTWARE.length}개</span></h1>
          <p>
            제작사가 직접 배포하는 원본 페이지로 연결합니다. 파일을 저희가 보관하거나 다시 포장하지
            않습니다. 설치할 때 딸려오는 프로그램이 있는지, 회사에서 써도 되는지를 먼저 적어
            두었습니다.
          </p>
        </div>
      </div>

      <div className="wrap sec">
        <div className="cats">
          {SW_CATEGORIES.map((c) => (
            <Link className="cat" key={c.slug} href={`/software/${c.slug}/`}>
              <span className="ci" style={{ background: c.bg }}><Icon3D id={SW_ICON[c.slug] || 'i-tool'} /></span>
              <span className="nm">{c.name}</span>
              <span className="ct num" style={{ color: c.fg }}>{counts[c.slug]}개</span>
            </Link>
          ))}
        </div>
        <div className="ad">광고 영역</div>
      </div>
    </>
  );
}
