'use client';
import { useEffect, useState } from 'react';
import { IconPrint } from './Icons';

// 서식은 한 번에 다 못 쓴다. 체크를 이 브라우저에 저장해 두면 다시 온다.
// 저장이 막힌 환경(시크릿 창·저장 차단)에서도 페이지는 그대로 동작해야 하므로
// 읽기·쓰기를 전부 try 로 감싼다.
export default function Checklist({ id, items }) {
  const [on, setOn] = useState(() => items.map(() => false));
  const [ready, setReady] = useState(false);
  const key = `chk:${id}`;

  useEffect(() => {
    try {
      const s = localStorage.getItem(key);
      if (s) {
        const arr = JSON.parse(s);
        if (Array.isArray(arr) && arr.length === items.length) setOn(arr);
      }
    } catch {}
    setReady(true);
  }, [key, items.length]);

  function toggle(i) {
    setOn((prev) => {
      const next = prev.map((v, j) => (j === i ? !v : v));
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  const cnt = on.filter(Boolean).length;

  return (
    <>
      <div className="chk">
        {items.map((t, i) => (
          <label key={i}>
            <input type="checkbox" checked={ready ? on[i] : false} onChange={() => toggle(i)} />
            <span>{t}</span>
          </label>
        ))}
      </div>
      <div className="chkfoot">
        <span className="chkbar"><i style={{ width: `${(cnt / items.length) * 100}%` }} /></span>
        <span className="chkcnt">{cnt} / {items.length}</span>
        <button className="prt" type="button" onClick={() => window.print()}>
          <IconPrint />인쇄
        </button>
      </div>
    </>
  );
}
