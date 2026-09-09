/**
 * 외부 기준선 대조 감시
 *   quiz.epostphone.kr 의 "오늘 자" 정답을 읽어 quiz.jjyu.co.kr 과 문항 단위로 맞춰본다.
 *     [누락]   저쪽에 있는데 우리에 없음      → 자동 발행 후보
 *     [오답]   양쪽에 있는데 정답 값이 다름   → 자동 수정 금지, 알림만
 *   기존 RULES 표 기반 누락검사·중복검사를 대체한다.
 */
const BASE = 'https://quiz.jjyu.co.kr';
const EXT = 'https://quiz.epostphone.kr';
const SNAP = process.env.SNAPSHOT || '';

const kst = () => new Date(Date.now() + 9 * 3600e3);
const today = kst().toISOString().slice(0, 10);
const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; quizday-audit/1.0)' };

async function get(u) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(u, { headers: UA, signal: AbortSignal.timeout(20000) });
      if (r.status === 404) return '';
      if (r.ok) return await r.text();
    } catch { /* 재시도 */ }
    await new Promise((x) => setTimeout(x, 700));
  }
  return '';
}
const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#0?39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const strip = (s) => unesc(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

function normAns(s) {
  return (s || '')
    .replace(/\(\s*(그렇다|아니다|아니에요|맞다|틀리다|O|X)\s*\)/gi, '')
    .replace(/^[①-⑳]\s*/, '')
    .replace(/^\d+\s*[.)]\s*/, '')
    // 퀴즈벨은 보기 번호를 "2번 5%" 처럼 한글로 붙인다. 안 벗기면 표기 차이가
    // 매번 [오답의심]으로 잡혀 헛알림이 된다 (2026-09-07 kbpay 실측).
    // 단 정답 자체가 "2번"인 문제(몇 번 출구 등)가 있으므로 벗긴 뒤가 비면 원본을 쓴다.
    .replace(/^(\d{1,2}\s*번[\s.)]*)(?=.)/, '')
    .replace(/[○◯]/g, 'O').replace(/[×✕]/g, 'X')
    .replace(/[\s.,'"`·]/g, '')
    .toUpperCase();
}
function toks(s) {
  return new Set((s || '').replace(/[^가-힣A-Za-z0-9]/g, ' ').split(/\s+/).filter((w) => w.length > 1));
}
function sim(a, b) {
  const A = toks(a), B = toks(b);
  if (!A.size || !B.size) return 0;
  let n = 0; for (const x of A) if (B.has(x)) n++;
  return n / Math.min(A.size, B.size);
}

const MAP = {
  auction: ['auction'], bitbunny: ['bitbunny', 'bitbunny-ox'], bitbunny_ox: ['bitbunny-ox'],
  cashwalk: ['cashwalk'], cashdoc: ['cashdoc'], climate: ['climate-action'],
  doctornow: ['doctornow', 'mydoctor'], hanaonecue: ['hana-onq'], hanalife: ['hana-life'],
  hpoint: ['hpoint'], kakaobank: ['kakaobank-ox'], kakaobank_ai: ['kakaobank'],
  kakaopay: ['kakaopay'], kbank: ['kbank'], kbpay: ['kbpay'],
  kbstar: ['kb-star'], kbstar_hist: ['kb-star'], monimo_eng: ['monimo-eng'], monimo_school: ['monimo'],
  nhallone: ['nh-allone'], okcashbag: ['ok-cashbag'], shinhan: ['shinhan-sol'],
  toss: ['toss-lucky'], buzzvil: ['buzzvil'], yoit: ['yoit'], moneywalk: ['moneywalk'],
  naverpay: ['naverpay'], yes24: ['yes24'], adapter: ['adapter'], fallcent: ['fallcent'],
};
function extKey(fileKey) {
  const m = fileKey.match(/^\d{4}-\d{2}-\d{2}-(.+?)-quiz-answer(?:-.*)?$/);
  return m ? m[1] : '';
}

async function readExternal() {
  const idx = await get(EXT + '/');
  if (!idx) return { ok: false, items: [] };
  const re = new RegExp(EXT.replace(/[.]/g, '\\.') + '/' + today + '-[a-z0-9_\\-]+', 'g');
  const urls = [...new Set(idx.match(re) || [])];
  const items = [];
  for (const u of urls) {
    const h = await get(u);
    if (!h) continue;
    const b = strip(h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ''));
    const m = b.match(/Q\.\s*([\s\S]{5,300}?)\s*정답\s*([\s\S]{1,60}?)\s*(?:📋|탭하면|복사)/);
    if (!m) continue;
    items.push({ key: u.slice(u.lastIndexOf('/') + 1), q: m[1].trim(), a: m[2].trim(), url: u });
  }
  return { ok: true, items };
}

async function readOurs() {
  if (SNAP) {
    const fs = await import('node:fs/promises');
    const raw = JSON.parse(await fs.readFile(SNAP, 'utf8'));
    const out = [];
    for (const [slug, v] of Object.entries(raw))
      for (const r of (v.rows || [])) out.push({ slug, n: r.n, q: r.q, a: r.a, choices: r.c || [] });
    return out;
  }
  const main = await get(BASE + '/');
  const slugs = [...new Set([...main.matchAll(/href="\/quiz\/([a-z0-9\-]+)\/"/g)].map((m) => m[1]))];
  const out = [];
  for (const slug of slugs) {
    const day = await get(BASE + '/quiz/' + slug + '/' + today + '/');
    if (!day) continue;
    const rx = new RegExp('/quiz/' + slug + '/' + today + '/(\\d+)/', 'g');
    const ns = [...new Set([...day.matchAll(rx)].map((m) => +m[1]))].sort((a, b) => a - b);
    for (const n of ns) {
      const p = await get(BASE + '/quiz/' + slug + '/' + today + '/' + n + '/');
      const av = p.match(/class="af-value"><span[^>]*>([\s\S]*?)<\/span>/);
      const ch = [...p.matchAll(/class="af-choice-chip"[^>]*>\s*<span[^>]*>([\s\S]*?)<\/span>/g)].map((x) => strip(x[1]));
      const q = p.match(/<title>([^<]*?)\s+—/);
      out.push({ slug, n, q: q ? unesc(q[1]) : '', a: av ? strip(av[1]) : '', choices: ch });
    }
  }
  return out;
}

const MATCH = 0.55;
(async () => {
  const [ext, ours] = await Promise.all([readExternal(), readOurs()]);
  // ⚠️ 기준선을 못 읽었다는 건 "이상 없음"이 아니라 "확인 못 함"이다.
  // 예전에는 여기서 exit(0) 으로 조용히 끝나서, 감시 작업이 "✅ 정상" 한 줄만 보고했다.
  // 2026-09-09 실측: 토막스가 Cloudflare 403 으로 온종일 막혔는데도 초록불이 켜졌고,
  // 그날 kakaobank-ox · hana-life · bitbunny-ox 가 통째로 비어 있는 걸 아무도 못 잡았다.
  // 감시가 눈을 감았으면 그 사실 자체가 알림이어야 한다 → exit(1).
  if (!ext.ok || ext.items.length === 0) {
    console.log('⚠️ [외부대조 불가] 기준선(quiz.epostphone.kr)을 읽지 못했습니다.');
    console.log('   → 이번 회차는 "이상 없음"이 아니라 "확인 못 함"입니다.');
    console.log('   → 기준선이 오래 막히면 그 소스에만 의존하는 퀴즈가 조용히 빕니다.');
    console.log(`   ${ext.ok ? '접속은 됐으나 오늘 자 항목이 0건' : '접속 실패(차단·다운 의심)'}`);
    process.exit(1);
  }
  const missing = [], wrong = [];
  for (const e of ext.items) {
    const cands = MAP[extKey(e.key)] || null;
    const pool = cands ? ours.filter((o) => cands.includes(o.slug)) : ours;
    // 안전망: 같은 퀴즈 안에 같은 정답이 이미 있으면 수집된 것으로 본다
    if (pool.some((o) => o.a && normAns(o.a) === normAns(e.a))) continue;
    let best = null, bs = 0;
    const search = pool.length ? pool : ours;
    for (const o of search) { const s2 = sim(e.q, o.q); if (s2 > bs) { bs = s2; best = o; } }
    if (!best || bs < MATCH) { missing.push({ ...e, mapped: cands ? cands.join('/') : '?' }); continue; }
    if (best.choices && best.choices.length) continue;
    if (normAns(best.a) !== normAns(e.a))
      wrong.push({ ...e, ourSlug: best.slug, ourN: best.n, ourA: best.a });
  }
  console.log('[외부대조] ' + today + ' · 기준선 ' + ext.items.length + '건 vs 우리 ' + ours.length + '건');
  if (!missing.length && !wrong.length) { console.log('✅ 차이 없음'); process.exit(0); }
  if (missing.length) {
    console.log('\n🔴 [누락] ' + missing.length + '건 — 기준선에 있는데 우리에 없음');
    for (const m of missing) console.log('  · [' + m.mapped + '] ' + m.q.slice(0, 60) + '\n      정답: ' + m.a + '\n      ' + m.url);
  }
  if (wrong.length) {
    console.log('\n🟠 [오답의심] ' + wrong.length + '건 — 정답 값이 다름 (자동 수정 금지)');
    for (const w of wrong) console.log('  · ' + w.ourSlug + ' ' + w.ourN + '번  우리:"' + w.ourA + '"  ≠  기준선:"' + w.a + '"\n      ' + w.q.slice(0, 50) + '\n      ' + w.url);
  }
  process.exit(1);
})();
