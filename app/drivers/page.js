import Link from 'next/link';
import Crumb from '../../components/Crumb';
import { Icon3D } from '../../components/Icons';
import { DV_CATEGORIES, DRIVERS, dvCountByCategory } from '../../lib/drivers';

export const metadata = {
  title: '드라이버 다운로드',
  description:
    '프린터 모델명으로 드라이버를 찾습니다. 파일이 여러 개일 때 어느 것을 받아야 하는지, 왜 제조사 홈페이지에 없는지까지 적었습니다.',
  alternates: { canonical: '/drivers/' },
};

export default function DriverIndex() {
  const counts = dvCountByCategory();
  return (
    <>
      <div className="head">
        <div className="wrap">
          <Crumb items={[{ name: '홈', href: '/' }, { name: '드라이버' }]} />
          <h1>드라이버 <span className="num">{DRIVERS.length}개 모델</span></h1>
          <p>
            모델명으로 찾으세요. 제조사 공식 지원 페이지로 연결하고, 그 페이지에 파일이 여러 개일
            때 <b>어느 것을 받아야 하는지</b>를 먼저 적어 두었습니다.
          </p>
        </div>
      </div>
      <div className="wrap sec">
        <div className="cats">
          {DV_CATEGORIES.map((c) => (
            <Link className="cat" key={c.slug} href={`/drivers/${c.slug}/`}>
              <span className="ci" style={{ background: c.bg }}><Icon3D id="i-printer" /></span>
              <span className="nm">{c.name}</span>
              <span className="ct num" style={{ color: c.fg }}>{counts[c.slug]}개 모델</span>
            </Link>
          ))}
        </div>
        <div className="ad">광고 영역</div>
      </div>
    </>
  );
}
