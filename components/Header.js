import Link from 'next/link';
import { IconDown, IconMenu } from './Icons';

export default function Header() {
  return (
    <header className="hd">
      <div className="wrap hd-in">
        <Link className="brand" href="/">
          <span className="mk"><IconDown /></span>
          <span className="tx">다운로드 인덱스</span>
        </Link>
        <div style={{ flex: 1 }} />
        <nav className="hdnav">
          <Link href="/forms/">서류·양식</Link>
          <span style={{ color: '#C3C8D2' }}>유틸리티</span>
          <span style={{ color: '#C3C8D2' }}>드라이버</span>
          <span style={{ color: '#C3C8D2' }}>폰트</span>
        </nav>
        <span className="burger" aria-hidden="true"><IconMenu /></span>
      </div>
    </header>
  );
}
