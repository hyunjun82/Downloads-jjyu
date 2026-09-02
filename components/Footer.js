import { CHECKED } from '../lib/forms';

export default function Footer() {
  return (
    <div className="foot">
      <div className="wrap" style={{ padding: '28px 20px 36px' }}>
        <div style={{ fontSize: 13, color: 'var(--ink3)', lineHeight: 1.75 }}>
          이 사이트는 서식 파일을 보관하거나 재배포하지 않습니다. 모든 내려받기는 발행 기관 페이지로 연결됩니다.
        </div>
        <div className="num" style={{ marginTop: 8, fontSize: 12.5, color: 'var(--ink3)' }}>
          © 2026 다운로드 인덱스 · {CHECKED} 확인
        </div>
      </div>
    </div>
  );
}
