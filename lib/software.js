import raw from '../data/software.json';

// forms.js 와 같은 이유로 정규화한다.
// 한글 슬러그는 NFC 로 맞추고, Next 가 퍼센트 인코딩된 채로 넘겨줄 때를 대비해 디코딩까지 한다.
const nfc = (s) => {
  let v = String(s);
  if (v.includes('%')) {
    try { v = decodeURIComponent(v); } catch { /* 잘못된 인코딩이면 원문 그대로 */ }
  }
  return v.normalize('NFC');
};

export const SW_CATEGORIES = raw.categories.map((c) => ({ ...c, slug: nfc(c.slug) }));
export const SOFTWARE = raw.software.map((s) => ({ ...s, slug: nfc(s.slug), cat: nfc(s.cat) }));

export function getSwCategory(slug) {
  const k = nfc(slug);
  return SW_CATEGORIES.find((c) => c.slug === k) || null;
}
export function getSwByCategory(slug) {
  const k = nfc(slug);
  return SOFTWARE.filter((s) => s.cat === k);
}
export function getSw(cat, slug) {
  const c = nfc(cat), k = nfc(slug);
  return SOFTWARE.find((s) => s.cat === c && s.slug === k) || null;
}
export function getSwBySlug(slug) {
  const k = nfc(slug);
  return SOFTWARE.find((s) => s.slug === k) || null;
}
export function swCountByCategory() {
  const m = {};
  for (const c of SW_CATEGORIES) m[c.slug] = 0;
  for (const s of SOFTWARE) m[s.cat] = (m[s.cat] || 0) + 1;
  return m;
}

// 카테고리마다 3D 아이콘을 하나씩 물려 둔다. 메인의 스프라이트를 그대로 쓴다.
export const SW_ICON = {
  browser: 'i-web',
  archive: 'i-tool',
  media: 'i-media',
  office: 'i-doc',
  security: 'i-sec',
  system: 'i-sys',
};

// 같은 분류의 다른 프로그램. 상세 페이지 아래에 붙인다.
export function relatedSw(cat, slug, n = 6) {
  const c = nfc(cat), k = nfc(slug);
  const same = SOFTWARE.filter((s) => s.cat === c && s.slug !== k);
  const rest = SOFTWARE.filter((s) => s.cat !== c);
  return [...same, ...rest].slice(0, n);
}
