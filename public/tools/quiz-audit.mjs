// quiz.jjyu.co.kr 감사 스크립트 — 실제로 사이트에 올라간 것을 검사한다.
//
// 왜 저장소가 아니라 사이트를 보는가 —
//   사람이 보는 건 사이트다. 저장소에 있어도 배포가 안 됐으면 없는 것이다.
//   그리고 사이트는 공개라 토큰이 필요 없다. 이 스크립트는 비밀을 하나도 모른다.
//
// 검사 네 가지. 전부 계산이지 판단이 아니다.
//   1) 누락  — 정해진 시각이 지났는데 건수가 모자란다      (규칙표 RULES)
//   2) 오염  — 문제 칸에 안내문이 들어갔다               (JUNK_Q)
//   3) 중복  — 같은 퀴즈·같은 날에 같은 문제나 같은 정답이 두 번
//   4) 정지  — 사이트 '업데이트' 시각이 90분 넘게 멈췄다
//
// 사용:  node quiz-audit.mjs            → 사람이 읽는 보고 + 종료코드(문제 있으면 1)
//        node quiz-audit.mjs --json     → JSON 한 덩어리 (자동화용)
//        AUDIT_DATE=2026-09-02 node …   → 특정 날짜 (기본: 오늘 KST)

const SITE = 'https://quiz.jjyu.co.kr';

// ── 누락 규칙 ─────────────────────────────────────────────
// [시각(KST 시), 그 시각까지 있어야 하는 최소 건수]
// 근거: 사이트 /guide/timetable/ 의 14일 실측 + 앱 공지 회차.
// 14일 중 14일 출제된 퀴즈만 '누락'으로 단정한다. 그보다 덜 규칙적인 것은 '주의'다.
// 사장님 보고 제외 4개(paybooc·skstoa·myhomeplus·syrup)는 아예 넣지 않는다.
const RULES = {
  //  slug            확정(miss)                       주의(warn)
  'cashwalk':      { miss: [[1,1],[12,3],[15,5],[20,8]] },
  'toss-lucky':    { miss: [[1,1],[10,2],[14,3]] },
  'adapter':       { miss: [[12,1],[16,2]],           warn: [[21,3]] },
  'shinhan-sol':   { miss: [[4,1],[11,2]] },
  'kakaobank':     { miss: [[9,1],[13,2]],            warn: [[21,3]] },   // 08·12·20시 하루 3회
  'kb-star':       { miss: [[2,1]],                   warn: [[12,2]] },
  'climate-action':{ miss: [[3,1]],                   warn: [[8,2]] },
  'kbank':         { miss: [[2,1]],                   warn: [[8,2]] },
  'mydoctor':      { miss: [[3,1]] },
  'doctornow':     { miss: [[2,1]],                   warn: [[9,2]] },
  'monimo':        { miss: [[1,1]] },
  'hana-onq':      { miss: [[3,1]] },
  'bitbunny':      { miss: [[1,1]] },
  'kbpay':         { miss: [[11,1]] },
  'hpoint':        { miss: [[12,1]] },
  'auction':       { miss: [[11,1]] },
  'yoit':          { miss: [[2,1]] },
  'bitbunny-ox':   {                                  warn: [[2,1]] },   // 13/14
  'moneywalk':     {                                  warn: [[12,1]] },  // 13/14
  'fallcent':      {                                  warn: [[20,1]] },  // 13/14
  'yes24':         {                                  warn: [[12,1]] },  // 12/14
  'cashdoc':       {                                  warn: [[12,1]] },  // 10/14
  // 2026-09-06~07 신설 카드. 이력이 이틀뿐이라 확정(miss) 기준을 잡을 근거가 없다.
  // 우선 주의(warn)만 걸어 "비어 있다"는 사실이 눈에 보이게 한다 — 알림은 울리지 않는다.
  // 관측된 발행 시각: kakaobank-ox 16:40·09:12 / hana-life 00:17 / monimo-eng 09:12
  'kakaobank-ox':  {                                  warn: [[18,1]] },
  'hana-life':     {                                  warn: [[12,1]] },
  'monimo-eng':    {                                  warn: [[12,1]] },
  // 불규칙 — 판정 기준이 없다. 검사 안 함: kakaopay(11/14) ok-cashbag(9/14) nh-allone(10/14) buzzvil(2/14) naverpay
};

// ── 오염 규칙 ─────────────────────────────────────────────
// 문제 칸에 들어가면 안 되는 문장. 기사 안내문·자리표시자.
const JUNK_Q = [
  /사용자마다/, /랜덤으로\s*(다르게|출제)/, /정답은\s*앱에서/, /앱에서\s*확인/, /잠시\s*후\s*공개/,
  /준비\s*중/, /업데이트\s*예정/, /아래에서\s*확인/, /기사\s*입력/, /무단\s*전재/, /저작권/,
  /^정답\s*[:：]/, /^문제\s*[:：]?\s*$/, /클릭하세요/, /참여하세요/, /추후\s*공개/,
];
const JUNK_A = [/잠시\s*후/, /준비\s*중/, /미공개/, /^\s*$/, /^-+$/, /^\?+$/, /확인\s*중/];
const MAX_ANSWER_LEN = 40;

// ── 유틸 ──────────────────────────────────────────────────
const kst = () => new Date(Date.now() + 9 * 3600 * 1000);
const today = process.env.AUDIT_DATE || kst().toISOString().slice(0, 10);
const nowHour = kst().getUTCHours() + kst().getUTCMinutes() / 60;

async function get(url) {
  const r = await fetch(url, { headers: { 'user-agent': 'quizday-audit/1.0' } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.text();
}
// 두 문장이 얼마나 겹치는지 (2글자 조각 기준). 0~1.
function jaccard(a, b) {
  const g = (t) => { t = t.replace(/\s+/g, ''); const s = new Set(); for (let i = 0; i < t.length - 1; i++) s.add(t.slice(i, i + 2)); return s; };
  const A = g(a), B = g(b); if (!A.size || !B.size) return 0;
  let inter = 0; for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}
const unesc = (s) => s.replace(/<!--.*?-->/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();

// ── 1. 메인 : 카드별 건수 ────────────────────────────────
function parseCards(html) {
  const out = {};
  const re = /<a href="\/quiz\/([a-z0-9-]+)\/" class="quiz-card">([\s\S]*?)<\/a>/g;
  let m;
  while ((m = re.exec(html))) {
    const slug = m[1], body = m[2];
    const badge = (body.match(/class="qc-badge[^"]*">([^<]*)</) || [, ''])[1];
    const name = (body.match(/class="qc-name">([^<]*)</) || [, slug])[1];
    const n = badge.match(/정답\s*(\d+)건/);
    out[slug] = { name: unesc(name), badge: unesc(badge), count: n ? Number(n[1]) : 0 };
  }
  return out;
}
function parseUpdated(html) {
  // "2026년 9월 2일 · 오후 02:01 업데이트"
  const m = html.replace(/<!--.*?-->/g, '').match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일\s*·\s*(오전|오후)\s*(\d{1,2}):(\d{2})\s*업데이트/);
  if (!m) return null;
  let h = Number(m[5]) % 12; if (m[4] === '오후') h += 12;
  return { date: `${m[1]}-${String(m[2]).padStart(2,'0')}-${String(m[3]).padStart(2,'0')}`, hour: h + Number(m[6]) / 60, text: m[0] };
}

// ── 2. 퀴즈 페이지 : 문제 목록 ───────────────────────────
function parseItems(html) {
  // ld+json ItemList 에서 문제와 URL 을 뽑는다. 화면 마크업보다 안정적이다.
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const b of blocks) {
    try {
      const j = JSON.parse(b[1]);
      const list = (j['@graph'] || [j]).find((x) => x['@type'] === 'ItemList' && Array.isArray(x.itemListElement));
      if (list) return list.itemListElement.map((it) => ({ q: unesc(String(it.name || '')), url: it.url }));
    } catch { /* 다음 블록 */ }
  }
  return [];
}
function parseAnswer(html) {
  // 일반형: 정답 한 칸
  const m = html.match(/class="af-value"><span[^>]*>([\s\S]*?)<\/span>/);
  if (m) return { value: unesc(m[1]), choices: [] };
  // 후보형: 문제가 랜덤으로 바뀌는 퀴즈(농협 디깅퀴즈 등)는 정답 후보를 여러 개 보여준다.
  //   <button class="af-choice-chip"><span data-nosnippet="true">메기 효과</span>...
  const ch = [...html.matchAll(/class="af-choice-chip"[^>]*>\s*<span[^>]*>([\s\S]*?)<\/span>/g)]
    .map((x) => unesc(x[1])).filter(Boolean);
  return { value: '', choices: ch };
}

// ── 3. 검사 ───────────────────────────────────────────────
async function main() {
  const problems = [];   // 확정 (종료코드 1)
  const warns = [];      // 주의 (종료코드 0, 보고만)
  const home = await get(`${SITE}/`);
  const cards = parseCards(home);
  const upd = parseUpdated(home);

  // 정지
  if (!upd) warns.push({ kind: '정지', slug: '-', msg: '메인에서 업데이트 시각을 못 읽음' });
  else if (upd.date !== today) problems.push({ kind: '정지', slug: '-', msg: `사이트가 ${upd.date} 에 멈춰 있음 (오늘 ${today})` });
  else if (nowHour - upd.hour > 1.5) problems.push({ kind: '정지', slug: '-', msg: `마지막 업데이트 ${upd.text} — ${((nowHour - upd.hour) * 60) | 0}분 전` });

  // 누락
  for (const [slug, rule] of Object.entries(RULES)) {
    const c = cards[slug];
    if (!c) { warns.push({ kind: '카드없음', slug, msg: '메인에 카드가 없음' }); continue; }
    for (const [h, min] of rule.miss || []) if (nowHour >= h + 0.25 && c.count < min)
      problems.push({ kind: '누락', slug, msg: `${c.name}: ${h}시 지났는데 ${c.count}건 (최소 ${min})` });
    for (const [h, min] of rule.warn || []) if (nowHour >= h + 0.25 && c.count < min)
      warns.push({ kind: '주의', slug, msg: `${c.name}: ${h}시 지났는데 ${c.count}건 (보통 ${min})` });
  }

  // 오염·중복 — 오늘 건수가 있는 퀴즈만 연다
  const detail = {};
  for (const [slug, c] of Object.entries(cards)) {
    if (!c.count) continue;
    let items;
    try { items = parseItems(await get(`${SITE}/quiz/${slug}/`)); } catch (e) { warns.push({ kind: '읽기실패', slug, msg: String(e.message) }); continue; }
    const rows = [];
    for (const it of items) {
      let a = '', choices = [];
      try { const r = parseAnswer(await get(it.url)); a = r.value; choices = r.choices; } catch { /* 정답 페이지 없음 */ }
      rows.push({ q: it.q, a, choices, url: it.url });
    }
    detail[slug] = rows;

    const seenQ = new Map(), seenA = new Map();
    rows.forEach((r, i) => {
      const n = i + 1;
      if (JUNK_Q.some((re) => re.test(r.q))) problems.push({ kind: '오염', slug, msg: `${c.name} ${n}번 문제가 안내문: “${r.q.slice(0, 40)}”`, url: r.url });
      const isMulti = r.choices && r.choices.length > 0;   // 후보형 페이지
      if (isMulti) {
        if (r.choices.length < 2) problems.push({ kind: '오염', slug, msg: `${c.name} ${n}번 후보가 ${r.choices.length}개뿐`, url: r.url });
      } else if (!r.a || JUNK_A.some((re) => re.test(r.a))) problems.push({ kind: '오염', slug, msg: `${c.name} ${n}번 정답이 비었거나 자리표시자: “${r.a}”`, url: r.url });
      else if (!isMulti && r.a.length > MAX_ANSWER_LEN) warns.push({ kind: '주의', slug, msg: `${c.name} ${n}번 정답이 ${r.a.length}자로 김: “${r.a.slice(0, 30)}…”`, url: r.url });
      const qk = r.q.replace(/\s+/g, ''); const ak = r.a.replace(/\s+/g, '');
      if (qk && seenQ.has(qk)) problems.push({ kind: '중복', slug, msg: `${c.name} ${n}번 문제가 ${seenQ.get(qk)}번과 같음`, url: r.url });
      else seenQ.set(qk, n);
      if (!isMulti && ak && seenA.has(ak)) {
        const prev = seenA.get(ak);
        const sim = jaccard(rows[prev - 1].q, r.q);
        const short = ak.length <= 2 || /^[OX○×]/.test(ak);           // O/X·한두 글자 정답은 겹쳐도 정상
        const junk = JUNK_Q.some((re) => re.test(r.q));
        if (junk || sim >= 0.5) problems.push({ kind: '중복', slug, msg: `${c.name} ${n}번이 ${prev}번과 같은 정답 “${r.a}” + 문제도 ${junk ? '안내문' : '유사'}`, url: r.url });
        else if (!short) warns.push({ kind: '주의', slug, msg: `${c.name} ${n}번과 ${prev}번 정답이 같음 “${r.a}” (문제는 다름 — 같은 상품 광고일 수 있음)`, url: r.url });
      } else seenA.set(ak, n);
    });
  }

  const withAnswers = Object.values(cards).filter((c) => c.count > 0).length;
  const summary = {
    date: today, checkedAt: kst().toISOString().replace('Z', '+09:00'),
    updated: upd && upd.text, quizzes: Object.keys(cards).length, withAnswers,
    totalAnswers: Object.values(cards).reduce((s, c) => s + c.count, 0),
    problems, warns,
  };

  if (process.argv.includes('--json')) { console.log(JSON.stringify(summary, null, 1)); }
  else {
    console.log(`[퀴즈 감사] ${summary.checkedAt.slice(0, 16)}  사이트 ${summary.updated || '?'}`);
    console.log(`정답 보유 ${withAnswers}/${summary.quizzes}개 · 총 ${summary.totalAnswers}건`);
    if (!problems.length) console.log('✅ 확정 문제 없음');
    for (const p of problems) console.log(`❌ [${p.kind}] ${p.msg}${p.url ? '  ' + p.url : ''}`);
    for (const w of warns) console.log(`⚠️  [${w.kind}] ${w.msg}${w.url ? '  ' + w.url : ''}`);
  }
  process.exit(problems.length ? 1 : 0);
}
main().catch((e) => { console.error('감사 스크립트 자체 오류:', e.message); process.exit(2); });
