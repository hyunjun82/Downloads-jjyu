import raw from '../data/forms.json';
import examples from '../data/examples.json';

// 한글 경로는 반드시 NFC 로 정규화한다.
// macOS 는 한글을 NFD(ㄱ+ㅗ+...)로 저장하는데, 리눅스·윈도우는 NFC(고)를 쓴다.
// 겉보기엔 같은 "고소장"이지만 바이트가 달라서, 정규화하지 않으면
// 빌드한 파일명과 링크가 어긋나 404 가 난다. 정적 사이트에서 실제로 자주 터지는 사고다.
// 게다가 Next 는 라우트 파라미터를 퍼센트 인코딩된 채로 넘겨줄 때가 있다
// (/forms/legal/%EA%B3%A0%EC%86%8C%EC%9E%A5). 디코딩까지 여기서 한 번에 끝낸다.
const nfc = (s) => {
  let v = String(s);
  if (v.includes('%')) {
    try { v = decodeURIComponent(v); } catch { /* 잘못된 인코딩이면 원문 그대로 */ }
  }
  return v.normalize('NFC');
};

export const CATEGORIES = raw.categories.map((c) => ({ ...c, slug: nfc(c.slug) }));
export const FORMS = raw.forms.map((f) => ({ ...f, slug: nfc(f.slug), cat: nfc(f.cat) }));

export function getCategory(slug) {
  const s = nfc(slug);
  return CATEGORIES.find((c) => c.slug === s) || null;
}

export function getFormsByCategory(slug) {
  const s = nfc(slug);
  return FORMS.filter((f) => f.cat === s);
}

export function getForm(cat, slug) {
  const c = nfc(cat);
  const s = nfc(slug);
  return FORMS.find((f) => f.cat === c && f.slug === s) || null;
}

export function getExample(cat, slug) {
  return examples[`${nfc(cat)}/${nfc(slug)}`] || null;
}

export function countByCategory() {
  const m = {};
  for (const f of FORMS) m[f.cat] = (m[f.cat] || 0) + 1;
  return m;
}

// 같은 분류의 다른 서식. 자기 자신은 뺀다.
export function related(cat, slug, n = 6) {
  return getFormsByCategory(cat).filter((f) => f.slug !== nfc(slug)).slice(0, n);
}

// 본문 표기용 아주 작은 변환기.
//   **굵게**  → <b>
//   {{채움}}  → 작성 예시에서 사람마다 바꿔 넣을 자리
// 마크다운 라이브러리를 끌어올 이유가 없다. 쓰는 표기가 둘뿐이다.
export function rich(text) {
  return String(text)
    .split(/(\*\*[^*]+\*\*|\{\{[^}]+\}\})/g)
    .filter((p) => p !== '')
    .map((p, i) => {
      if (p.startsWith('**') && p.endsWith('**')) return { k: 'b', t: p.slice(2, -2), i };
      if (p.startsWith('{{') && p.endsWith('}}')) return { k: 'f', t: p.slice(2, -2), i };
      return { k: 't', t: p, i };
    });
}

// 요약문에서 표기 기호를 걷어낸다. 메타 설명·JSON-LD 처럼
// 태그를 넣을 수 없는 자리에 쓴다.
export function plain(text) {
  return String(text).replace(/\*\*|\{\{|\}\}/g, '');
}

// 받침이 있으면 '이', 없으면 '가'. 기관 이름이 데이터에서 오기 때문에
// 조사를 고정해 두면 "대한법률구조공단가" 같은 말이 검색결과에 그대로 나간다.
export function josa(word, pair = '이가') {
  const last = String(word).trim().slice(-1);
  const code = last.charCodeAt(0);
  const hangul = code >= 0xac00 && code <= 0xd7a3;
  const hasBatchim = hangul && (code - 0xac00) % 28 !== 0;
  return word + (hasBatchim ? pair[0] : pair[1]);
}

export const SITE_URL = 'https://downloads.jjyu.co.kr';
export const SITE_NAME = '다운로드 인덱스';
export const CHECKED = '2026-08-14';
