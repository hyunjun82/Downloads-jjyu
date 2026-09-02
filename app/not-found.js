import Link from 'next/link';

export const metadata = { title: '페이지를 찾을 수 없습니다' };

export default function NotFound() {
  return (
    <div className="wrap sec" style={{ textAlign: 'center', padding: '80px 20px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--ink)', letterSpacing: '-.05em', margin: 0 }}>
        페이지를 찾을 수 없습니다
      </h1>
      <p style={{ marginTop: 12, color: 'var(--ink2)' }}>
        주소가 바뀌었거나 삭제된 페이지입니다.
      </p>
      <Link className="allbtn" href="/forms/">서류·양식 보러 가기</Link>
    </div>
  );
}
