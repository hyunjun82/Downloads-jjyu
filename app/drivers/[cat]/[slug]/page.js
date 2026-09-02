import Link from 'next/link';
import { notFound } from 'next/navigation';
import Crumb from '../../../../components/Crumb';
import Rich from '../../../../components/Rich';
import { Icon3D, IconDown, IconWarn } from '../../../../components/Icons';
import { DRIVERS, getDriver, getDvCategory } from '../../../../lib/drivers';

// 드라이버 상세.
//
// 서식·프로그램과 결정적으로 다른 점 하나 — 받을 파일이 한 개가 아니다.
// SL-M2020 만 해도 HP 지원 페이지에 파일이 일곱 개 있다. 사람들이 막히는 지점은
// "드라이버가 어디 있나"가 아니라 "이 중에 뭘 받아야 하나"다.
// 그래서 이 페이지는 목록보다 「무엇을 받아야 하나」를 맨 위에 둔다.

export function generateStaticParams() {
  return DRIVERS.map((d) => ({ cat: d.cat, slug: d.slug }));
}

export function generateMetadata({ params }) {
  const d = getDriver(params.cat, params.slug);
  if (!d) return {};
  return {
    title: `${d.title} 다운로드`,
    description: `${d.series} 드라이버. ${d.host} 공식 지원 페이지에 파일이 ${d.files.length}개 있습니다. 어느 것을 받아야 하는지와 설치 순서, 안 될 때 확인할 것을 정리했습니다.`,
    alternates: { canonical: `/drivers/${d.cat}/${d.slug}/` },
  };
}

export default function DriverDetail({ params }) {
  const d = getDriver(params.cat, params.slug);
  if (!d) notFound();
  const c = getDvCategory(d.cat);
  const main = d.files.find((f) => f.main) || d.files[0];

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: d.faq.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a.replace(/\*\*/g, '') },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <div className="head">
        <div className="wrap">
          <Crumb items={[
            { name: '홈', href: '/' },
            { name: '드라이버', href: '/drivers/' },
            { name: c.name, href: `/drivers/${c.slug}/` },
            { name: d.model },
          ]} />
          <h1>{d.title}</h1>
          <p>{d.series} · {d.checked} 확인</p>
        </div>
      </div>

      <div className="wrap sec">
        <div className="swlay">
          <div className="swmain">

            {/* 무엇을 받아야 하나 — 이 페이지의 존재 이유다. */}
            <section className="pick">
              <span className="pl">파일이 {d.files.length}개입니다. 이것 하나만 받으세요</span>
              <b>{d.pickFirst}</b>
              <span className="pv">{main.ver} · {main.size} · {main.date}</span>
              <p>{d.pickWhy}</p>
              <a className="dlbtn" href={`/dv/${d.cat}/${d.slug}/`} target="_blank" rel="noopener">
                <IconDown />{d.host} 공식 지원 페이지로 가기
              </a>
              <p className="dlnote">
                파일은 저희가 보관하지 않습니다. 누르시면 {d.host} 페이지가 열립니다.
              </p>
            </section>

            {/* 제조사가 아니라 다른 회사가 배포하는 이유. 사람들이 가장 헤매는 지점이다. */}
            {d.hostNote && (
              <div className="note">
                <span className="ni"><IconWarn /></span>
                <p><b>{d.maker} 홈페이지에는 없습니다.</b> {d.hostNote}</p>
              </div>
            )}

            <div className="trust">
              <div><b>제조사</b><span>{d.maker}</span></div>
              <div><b>배포처</b><span>{d.host} 공식</span></div>
              <div><b>파일 수</b><span>{d.files.length}개</span></div>
              <div><b>확인한 날</b><span>{d.checked}</span></div>
            </div>

            <section>
              <h2 className="h2">이 드라이버를 쓰는 모델</h2>
              <div className="models">
                {d.alsoFits.map((m) => (
                  <span className={`model${m === d.model ? ' on' : ''}`} key={m}>{m}</span>
                ))}
              </div>
              <p className="sechint" style={{ margin: '12px 0 0' }}>
                끝의 W 는 무선 지원 여부만 다르고, 드라이버는 같은 것을 씁니다.
              </p>
            </section>

            <div className="ad">광고 영역</div>

            {/* 파일 전체 목록 — 실측한 값 그대로. */}
            <section>
              <h2 className="h2">{d.host} 지원 페이지의 파일 {d.files.length}개</h2>
              <p className="sechint">
                {d.checked} 에 직접 열어 확인한 값입니다. 각각 언제 필요한지 적었습니다.
              </p>
              <div className="files">
                {d.files.map((f) => (
                  <div className={`file${f.main ? ' on' : ''}`} key={f.name}>
                    <div className="fh">
                      <b>{f.name}</b>
                      {f.main && <span className="badge k">이것부터</span>}
                    </div>
                    <div className="fm">
                      <span>{f.kind}</span>
                      <span className="num">{f.ver}</span>
                      <span className="num">{f.size}</span>
                      <span className="num">{f.date}</span>
                    </div>
                    <p>{f.when}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="h2">설치 순서</h2>
              <ol className="steps">
                {d.steps.map(([t, v]) => (
                  <li key={t}><b>{t}</b><Rich text={v} /></li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="h2">안 될 때 확인할 것</h2>
              <div className="faq">
                {d.trouble.map(([q, a]) => (
                  <details key={q}>
                    <summary>{q}</summary>
                    <p><Rich text={a} /></p>
                  </details>
                ))}
              </div>
            </section>

            <section>
              <h2 className="h2">자주 묻는 질문</h2>
              <div className="faq">
                {d.faq.map(([q, a]) => (
                  <details key={q}>
                    <summary>{q}</summary>
                    <p><Rich text={a} /></p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <aside className="side">
            <h3>모델명이 다른가요</h3>
            <div className="box">
              {d.alsoFits.map((m) => (
                <span key={m} style={{ display: 'flex', padding: '12px 14px', borderBottom: '1px solid var(--line)', fontSize: 14 }}>
                  {m}
                  <span className="r" style={{ marginLeft: 'auto' }}>같은 드라이버</span>
                </span>
              ))}
            </div>
            <p className="note2">
              프린터 앞면이나 뒷면 스티커에 적힌 모델명을 확인하세요. 목록에 없으면 {d.host} 지원
              페이지에서 그 모델명으로 검색하시면 됩니다.
            </p>
            <div className="ad">광고 영역</div>
          </aside>
        </div>
      </div>
    </>
  );
}
