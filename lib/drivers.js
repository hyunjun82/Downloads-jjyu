import raw from '../data/drivers.json';

// forms.js · software.js 와 같은 이유로 정규화한다.
const nfc = (s) => {
  let v = String(s);
  if (v.includes('%')) {
    try { v = decodeURIComponent(v); } catch { /* 잘못된 인코딩이면 원문 그대로 */ }
  }
  return v.normalize('NFC');
};

export const DV_CATEGORIES = raw.categories.map((c) => ({ ...c, slug: nfc(c.slug) }));
export const DRIVERS = raw.drivers.map((d) => ({ ...d, slug: nfc(d.slug), cat: nfc(d.cat) }));

export function getDvCategory(slug) {
  const k = nfc(slug);
  return DV_CATEGORIES.find((c) => c.slug === k) || null;
}
export function getDvByCategory(slug) {
  const k = nfc(slug);
  return DRIVERS.filter((d) => d.cat === k);
}
export function getDriver(cat, slug) {
  const c = nfc(cat), k = nfc(slug);
  return DRIVERS.find((d) => d.cat === c && d.slug === k) || null;
}
export function dvCountByCategory() {
  const m = {};
  for (const c of DV_CATEGORIES) m[c.slug] = 0;
  for (const d of DRIVERS) m[d.cat] = (m[d.cat] || 0) + 1;
  return m;
}
