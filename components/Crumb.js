import Link from 'next/link';
import { IconRight } from './Icons';

// items : [{ name, href }] · 마지막 항목은 href 없이 넣는다.
export default function Crumb({ items }) {
  return (
    <div className="crumb">
      {items.map((it, i) => (
        <span key={i} style={{ display: 'contents' }}>
          {i > 0 && <IconRight />}
          {it.href ? <Link href={it.href}>{it.name}</Link>
            : <span style={{ color: 'var(--ink2)' }}>{it.name}</span>}
        </span>
      ))}
    </div>
  );
}
