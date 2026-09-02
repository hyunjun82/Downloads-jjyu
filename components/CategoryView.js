'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Crumb from './Crumb';
import { IconSearch, IconDown } from './Icons';

// 목록은 카드가 아니라 목록으로 둔다. 소프토닉 상세를 실측해 보면
// 본문에 카드가 하나도 없다. 카드를 겹치면 정보 밀도가 떨어지고 블로그처럼 보인다.
export default function CategoryView({ cat, forms, others, viewers }) {
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return forms;
    return forms.filter(
      (f) => f.title.toLowerCase().includes(s) || f.summary.toLowerCase().includes(s)
    );
  }, [q, forms]);

  return (
    <>
      <div className="top">
        <div className="wrap">
          <Crumb items={[{ name: '홈', href: '/' }, { name: '서류·양식', href: '/forms/' }, { name: cat.name }]} />
          <h1>{cat.name} 서식<span className="cnt num">{forms.length}건</span></h1>
          <p className="lead">{cat.lead || cat.desc}</p>
          <div className="find">
            <IconSearch />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="이 분류에서 찾기"
              aria-label={`${cat.name} 서식 검색`}
            />
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="layout list-l">
          <div>
            <div className="bar">
              <span className="l">{q ? <>‘{q}’ <b>{list.length}</b>건</> : <>전체 <b>{forms.length}</b>건</>}</span>
            </div>

            {list.length === 0 ? (
              <p style={{ padding: '28px 2px', color: 'var(--ink3)', fontSize: 15 }}>
                찾는 서식이 없습니다. 다른 낱말로 찾아보시거나 위의 분류를 눌러 보세요.
              </p>
            ) : (
              <div className="list">
                {list.map((f) => (
                  <Link className="it" key={f.slug} href={`/forms/${cat.slug}/${f.slug}/`}>
                    <span className="sheet">
                      <i /><b className={f.ext === 'HWP' ? undefined : 'd'}>{f.ext}</b>
                    </span>
                    <span className="c">
                      <span className="nm">{f.title}</span>
                      <span className="ds">{f.summary}</span>
                      <span className="mt">
                        {f.hasExample && <span className="ex">작성 예시</span>}
                        {f.issuer}<span>·</span><span className="num">{f.checked} 확인</span>
                      </span>
                    </span>
                    <span className="go"><IconDown /></span>
                  </Link>
                ))}
              </div>
            )}

            <div className="ad">광고 영역</div>
          </div>

          <div className="side">
            <h3>다른 분류</h3>
            <div className="box">
              {others.map((c) => (
                <Link key={c.slug} href={`/forms/${c.slug}/`}>
                  {c.name}<span className="r num">{c.count}</span>
                </Link>
              ))}
            </div>
            <h3 style={{ marginTop: 26 }}>함께 찾는 프로그램</h3>
            <div className="box">
              {viewers.map((v) => (
                <a key={v.name} href={v.url} target="_blank" rel="noopener nofollow">
                  {v.name}<span className="r">{v.ext}</span>
                </a>
              ))}
            </div>
            <p className="note2">받은 서식이 열리지 않으면 뷰어를 먼저 설치하세요. 모두 공식 배포처로 연결됩니다.</p>
          </div>
        </div>
      </div>
    </>
  );
}
