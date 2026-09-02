'use client';
import { useState } from 'react';
import { IconCopy } from './Icons';

// 예시를 눈으로 옮겨 적는 수고를 없앤다. 공단도 예스폼도 안 하는 것이라
// 이 페이지가 원본 배포처보다 나은 실질적인 이유가 된다.
export default function CopyButton({ text }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // 구형 브라우저·비보안 문맥에서는 클립보드 API 가 없다.
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
    }
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  }
  return (
    <button type="button" className={done ? 'cpy done' : 'cpy'} onClick={copy}>
      <IconCopy />{done ? '복사됨' : '복사'}
    </button>
  );
}
