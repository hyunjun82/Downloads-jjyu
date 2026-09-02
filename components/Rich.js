import { rich } from '../lib/forms';

// **굵게** 와 {{채움}} 만 처리한다.
export default function Rich({ text }) {
  return rich(text).map((p) =>
    p.k === 'b' ? <b key={p.i}>{p.t}</b>
      : p.k === 'f' ? <span className="fill" key={p.i}>{p.t}</span>
        : <span key={p.i}>{p.t}</span>
  );
}

// 줄바꿈(\n)까지 살려야 하는 자리 — 작성 예시의 고소인·피고소인 칸.
export function RichLines({ text }) {
  const lines = String(text).split('\n');
  return lines.map((line, i) => (
    <span key={i}>
      {i > 0 && <br />}
      <Rich text={line} />
    </span>
  ));
}
