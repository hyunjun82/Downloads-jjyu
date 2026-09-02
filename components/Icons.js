// 아이콘은 전부 직접 그린다. 이모지는 크기·색·정렬이 기기마다 달라져서 못 쓴다.
export function Ln({ d, w = 1.8, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" className="ln" strokeWidth={w} {...rest}>
      {d.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

export const IconDown = (p) => <Ln d={['M12 4v10', 'm7.8 10.2 4.2 4.2 4.2-4.2', 'M5 19.5h14']} w={2.2} {...p} />;
export const IconRight = (p) => <Ln d={['m9 5 7 7-7 7']} {...p} />;
export const IconMenu = (p) => <Ln d={['M4 7h16', 'M4 12h16', 'M4 17h16']} {...p} />;
export const IconSearch = () => (
  <svg viewBox="0 0 24 24" className="ln"><circle cx="11" cy="11" r="6.5" /><path d="m19 19-3.6-3.6" /></svg>
);
export const IconEye = () => (
  <svg viewBox="0 0 24 24" className="ln"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></svg>
);
export const IconFile = (p) => <Ln d={['M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z', 'M14 3v5h5']} {...p} />;
export const IconWarn = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8.5v5" /><path d="M12 17h.01" /><path d="M10.3 4.2 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z" />
  </svg>
);
export const IconCopy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </svg>
);
export const IconPrint = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9V3h12v6" /><rect x="4" y="9" width="16" height="8" rx="2" /><path d="M6 17h12v4H6z" />
  </svg>
);

// 서류 아이콘. 그라데이션을 쓰므로 문서마다 한 번만 정의하고 <use> 로 부른다.
export function DocSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <linearGradient id="fDoc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A9C7FF" /><stop offset="1" stopColor="#1E5FE0" />
        </linearGradient>
        <linearGradient id="fPap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#EAF1FE" />
        </linearGradient>
      </defs>
      <symbol id="s-doc" viewBox="0 0 64 64">
        <ellipse cx="32" cy="55.5" rx="17" ry="3.4" fill="#1E5FE0" opacity=".16" />
        <rect x="19" y="12" width="27" height="37" rx="6" fill="url(#fDoc)" transform="rotate(9 32 30)" />
        <path d="M21 10h13.5L46 21.5V45a5 5 0 0 1-5 5H21a5 5 0 0 1-5-5V15a5 5 0 0 1 5-5Z" fill="url(#fPap)" />
        <path d="M34.5 10 46 21.5h-7.5a4 4 0 0 1-4-4V10Z" fill="#D3E3FD" />
        <rect x="22" y="29" width="17" height="3.4" rx="1.7" fill="#A9C7FF" />
        <rect x="22" y="36.5" width="11" height="3.4" rx="1.7" fill="#DDEAFE" />
      </symbol>
    </svg>
  );
}
export const DocIcon = () => <svg><use href="#s-doc" /></svg>;
