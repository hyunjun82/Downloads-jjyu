'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { IconSearch } from './Icons';

// 건수가 몇백 건이면 색인을 통째로 내려받아 브라우저에서 찾는 편이 빠르다.
// 서버도 필요 없고, 정적 배포와도 잘 맞는다.
export default function HomeSearch({ items }) {
  const [q, setQ] = useState('');
  const [focus, setFocus] = useState(false);

  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return items
      .filter((it) => it.n.toLowerCase().includes(s) || it.c.toLowerCase().includes(s))
      .slice(0, 7);
  }, [q, items]);

  const open = focus && q.trim() !== '';

  return (
    <div className="sbox">
      <div className="sform">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 140)}
          placeholder="고소장, 근로계약서, 곰플레이어…"
          aria-label="서식·프로그램 검색"
        />
        <span className="go"><IconSearch /></span>
      </div>
      {open && (
        <div className="sres">
          {hits.length === 0 ? (
            <div className="empty">‘{q}’에 맞는 항목이 없습니다.</div>
          ) : (
            hits.map((it) => (
              <Link key={it.h} href={it.h}>
                <span className="tg">{it.t}</span>
                <span className="nm">{it.n}</span>
                <span className="ct">{it.c}</span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
