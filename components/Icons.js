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

// ── 3D 아이콘 스프라이트 ──────────────────────────────
// 어제 캔버스(Main.dc.html)에서 직접 그린 것을 그대로 옮겼다.
// 그라데이션을 쓰므로 문서마다 한 번만 정의하고 <use> 로 부른다.
// 이모지를 쓰지 않는 이유 : 기기마다 모양·크기·색이 달라져서 디자인이 무너진다.
export function Sprite() {
  return (
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
      <linearGradient id="pDoc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#A9C7FF"/><stop offset="1" stopColor="#1E5FE0"/></linearGradient>
      <linearGradient id="pPap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF"/><stop offset="1" stopColor="#EAF1FE"/></linearGradient>
      <linearGradient id="pTool" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7FD9CE"/><stop offset="1" stopColor="#0D8F84"/></linearGradient>
      <linearGradient id="pMed" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFAFBE"/><stop offset="1" stopColor="#D02E52"/></linearGradient>
      <linearGradient id="pPrn" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8BE9C2"/><stop offset="1" stopColor="#0C8F5F"/></linearGradient>
      <linearGradient id="pFnt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFD98A"/><stop offset="1" stopColor="#C1780C"/></linearGradient>
      <linearGradient id="pGam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FBA9E0"/><stop offset="1" stopColor="#A3229E"/></linearGradient>
      <linearGradient id="pAi"  x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFC48C"/><stop offset="1" stopColor="#E8631A"/></linearGradient>
      <linearGradient id="pAi2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFD9B4"/><stop offset="1" stopColor="#F58A3C"/></linearGradient>
      </defs>

      <symbol id="i-doc" viewBox="0 0 64 64">
      <ellipse cx="32" cy="55.5" rx="17" ry="3.4" fill="#1E5FE0" opacity=".16"/>
      <rect x="19" y="12" width="27" height="37" rx="6" fill="url(#pDoc)" transform="rotate(9 32 30)"/>
      <path d="M21 10h13.5L46 21.5V45a5 5 0 0 1-5 5H21a5 5 0 0 1-5-5V15a5 5 0 0 1 5-5Z" fill="url(#pPap)"/>
      <path d="M34.5 10 46 21.5h-7.5a4 4 0 0 1-4-4V10Z" fill="#D3E3FD"/>
      <rect x="22" y="29" width="17" height="3.4" rx="1.7" fill="#A9C7FF"/>
      <rect x="22" y="36.5" width="11" height="3.4" rx="1.7" fill="#DDEAFE"/>
      </symbol>

      <symbol id="i-tool" viewBox="0 0 64 64">
      <ellipse cx="32" cy="55.5" rx="16" ry="3.4" fill="#0D8F84" opacity=".16"/>
      <g fill="url(#pTool)">
      <rect x="28" y="7" width="8" height="13" rx="3.6"/>
      <rect x="28" y="7" width="8" height="13" rx="3.6" transform="rotate(45 32 30)"/>
      <rect x="28" y="7" width="8" height="13" rx="3.6" transform="rotate(90 32 30)"/>
      <rect x="28" y="7" width="8" height="13" rx="3.6" transform="rotate(135 32 30)"/>
      <rect x="28" y="7" width="8" height="13" rx="3.6" transform="rotate(180 32 30)"/>
      <rect x="28" y="7" width="8" height="13" rx="3.6" transform="rotate(225 32 30)"/>
      <rect x="28" y="7" width="8" height="13" rx="3.6" transform="rotate(270 32 30)"/>
      <rect x="28" y="7" width="8" height="13" rx="3.6" transform="rotate(315 32 30)"/>
      <circle cx="32" cy="30" r="16.5"/>
      </g>
      <circle cx="32" cy="30" r="7" fill="#EAFAF7"/>
      <path d="M21.5 23a13.5 13.5 0 0 1 11-5.5" stroke="#fff" strokeOpacity=".5" strokeWidth="3.2" strokeLinecap="round" fill="none"/>
      </symbol>

      <symbol id="i-media" viewBox="0 0 64 64">
      <ellipse cx="32" cy="55.5" rx="17" ry="3.4" fill="#D02E52" opacity=".16"/>
      <rect x="9" y="14" width="46" height="33" rx="11" fill="url(#pMed)"/>
      <path d="M20 14h24c6.1 0 11 4.9 11 11v1H9v-1c0-6.1 4.9-11 11-11Z" fill="#fff" opacity=".2"/>
      <path d="M27.5 24.5 40 30.5 27.5 36.5z" fill="#fff"/>
      </symbol>

      <symbol id="i-printer" viewBox="0 0 64 64">
      <ellipse cx="32" cy="55.5" rx="16" ry="3.4" fill="#0C8F5F" opacity=".16"/>
      <rect x="19" y="8" width="26" height="14" rx="3" fill="#fff" stroke="#D8EFE5" strokeWidth="1.4"/>
      <rect x="13" y="20" width="38" height="20" rx="7" fill="url(#pPrn)"/>
      <rect x="13" y="20" width="38" height="7" rx="7" fill="#fff" opacity=".22"/>
      <circle cx="44" cy="30" r="2.4" fill="#fff" opacity=".9"/>
      <rect x="19" y="36" width="26" height="16" rx="3" fill="#fff" stroke="#D8EFE5" strokeWidth="1.4"/>
      <rect x="23" y="41" width="13" height="2.6" rx="1.3" fill="#A7EBCF"/>
      <rect x="23" y="46" width="18" height="2.6" rx="1.3" fill="#D6F3E6"/>
      </symbol>

      <symbol id="i-font" viewBox="0 0 64 64">
      <ellipse cx="32" cy="55.5" rx="16" ry="3.4" fill="#C1780C" opacity=".16"/>
      <rect x="11" y="11" width="42" height="40" rx="13" fill="url(#pFnt)"/>
      <path d="M24 11h16c7.2 0 13 5.8 13 13v2H11v-2c0-7.2 5.8-13 13-13Z" fill="#fff" opacity=".2"/>
      <text x="32" y="42" textAnchor="middle" fontSize="26" fontWeight="900" fill="#fff" fontFamily="Georgia,serif">Aa</text>
      </symbol>

      <symbol id="i-game" viewBox="0 0 64 64">
      <ellipse cx="32" cy="55.5" rx="18" ry="3.4" fill="#A3229E" opacity=".16"/>
      <path d="M21 19h22c7.7 0 13 6.4 13 14.2 0 6.3-3.2 11.3-8.3 11.3-4.2 0-6.2-3.2-9.3-3.2h-12c-3.1 0-5.1 3.2-9.3 3.2C12 44.5 8 39.5 8 33.2 8 25.4 13.3 19 21 19Z" fill="url(#pGam)"/>
      <rect x="16" y="30.4" width="11" height="3.6" rx="1.8" fill="#fff"/>
      <rect x="19.7" y="26.7" width="3.6" height="11" rx="1.8" fill="#fff"/>
      <circle cx="42.5" cy="29.5" r="3.1" fill="#fff"/>
      <circle cx="48.5" cy="35" r="3.1" fill="#fff"/>
      <path d="M15 23.5a13 13 0 0 1 9-4" stroke="#fff" strokeOpacity=".45" strokeWidth="3.2" strokeLinecap="round" fill="none"/>
      </symbol>

      <symbol id="i-ai" viewBox="0 0 64 64">
      <ellipse cx="32" cy="55.5" rx="16" ry="3.4" fill="#E8631A" opacity=".16"/>
      <path d="M30 8.5c.6-1.7 3-1.7 3.6 0l3.6 10 10 3.6c1.7.6 1.7 3 0 3.6l-10 3.6-3.6 10c-.6 1.7-3 1.7-3.6 0l-3.6-10-10-3.6c-1.7-.6-1.7-3 0-3.6l10-3.6 3.6-10Z" fill="url(#pAi)"/>
      <path d="M46.4 35c.3-.9 1.6-.9 1.9 0l1.6 4.4 4.4 1.6c.9.3.9 1.6 0 1.9l-4.4 1.6-1.6 4.4c-.3.9-1.6.9-1.9 0l-1.6-4.4-4.4-1.6c-.9-.3-.9-1.6 0-1.9l4.4-1.6 1.6-4.4Z" fill="url(#pAi2)"/>
      <path d="M16.6 38.5c.25-.7 1.25-.7 1.5 0l1.2 3.3 3.3 1.2c.7.25.7 1.25 0 1.5l-3.3 1.2-1.2 3.3c-.25.7-1.25.7-1.5 0l-1.2-3.3-3.3-1.2c-.7-.25-.7-1.25 0-1.5l3.3-1.2 1.2-3.3Z" fill="url(#pAi2)"/>
      </symbol>
      </svg>
  );
}

// 상세 페이지에서 쓰는 서류 아이콘 (기존 이름 유지)
export const DocSprite = Sprite;
export const DocIcon = () => <svg><use href="#i-doc" /></svg>;

// 카테고리 아이콘 — id 로 골라 쓴다
export const Icon3D = ({ id }) => <svg><use href={`#${id}`} /></svg>;
