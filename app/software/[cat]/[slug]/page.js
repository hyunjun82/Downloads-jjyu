import Link from 'next/link';
import { notFound } from 'next/navigation';
import Crumb from '../../../../components/Crumb';
import Rich from '../../../../components/Rich';
import { Icon3D, IconDown, IconWarn } from '../../../../components/Icons';
import {
  SOFTWARE, getSw, getSwCategory, getSwBySlug, relatedSw, SW_ICON,
} from '../../../../lib/software';

// 프로그램 상세.
// 어제 시안(_design/download-page-redesign.html)의 구성을 그대로 옮겼다.
//   세 줄 요약 → 받기 → 신뢰 정보 한 줄 → 나에게 맞나 → 장단점 → 사양 → 자주 묻는 질문 → 대안
// 시안에 있던 '누적 다운로드 수·별점·리뷰 수·백신 3종 검사'는 넣지 않았다.
// 우리는 파일을 보관하지도, 검사하지도 않는다. 없는 것을 있다고 적으면 그때부터 이 사이트를
// 믿을 이유가 사라진다. 대신 우리가 실제로 확인한 것(공식 배포처·번들 여부·라이선스·지원 OS)만 적는다.

export function generateStaticParams() {
  return SOFTWARE.map((s) => ({ cat: s.cat, slug: s.slug }));
}

export function generateMetadata({ params }) {
  const s = getSw(params.cat, params.slug);
  if (!s) return {};
  const bits = [];
  if (s.version) bits.push(`${s.version} 버전`);
  bits.push(`${s.vendor} 공식 배포처 연결`);
  if (s.bundle === false) bits.push('딸려오는 프로그램 없음');
  if (s.bundle === true) bits.push('설치 시 제휴 프로그램 제안 있음');
  return {
    title: `${s.name} 다운로드`,
    description: `${s.summary} ${bits.join(' · ')}. 어떤 사람에게 맞는지, 설치할 때 무엇을 조심해야 하는지까지 정리했습니다.`,
    alternates: { canonical: `/software/${s.cat}/${s.slug}/` },
  };
}

export default function SwDetail({ params }) {
  const s = getSw(params.cat, params.slug);
  if (!s) notFound();
  const c = getSwCategory(s.cat);
  const alts = (s.alts || []).map(getSwBySlug).filter(Boolean);
  const rel = relatedSw(s.cat, s.slug, 6);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: s.name,
    alternateName: s.nameEn,
    applicationCategory: c.name,
    operatingSystem: s.os.join(', '),
    ...(s.version ? { softwareVersion: s.version } : {}),
    author: { '@type': 'Organization', name: s.vendor },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
    inLanguage: 'ko-KR',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <div className="head">
        <div className="wrap">
          <Crumb items={[
            { name: '홈', href: '/' },
            { name: '프로그램', href: '/software/' },
            { name: c.name, href: `/software/${c.slug}/` },
            { name: s.name },
          ]} />
          <h1>{s.name} 다운로드</h1>
          <p>{s.nameEn} · {s.vendor}</p>
        </div>
      </div>

      <div className="wrap sec">
        <div className="swlay">
          <div className="swmain">

            {/* 세 줄 요약 — 시안의 첫 블록. 스크롤하기 전에 판단이 끝나야 한다. */}
            <section className="lead3">
              <h2 className="h2">세 줄 요약</h2>
              {s.lead.map(([t, d], i) => (
                <div className="l3" key={i}>
                  <b>{t}</b>
                  <span>{d}</span>
                </div>
              ))}
            </section>

            {/* 받기 — 버튼은 페이지에 하나뿐이다. 가짜 버튼과 헷갈릴 여지를 없앤다. */}
            <section className="dlcard">
              <span className="goci" style={{ background: c.bg }}>
                <Icon3D id={SW_ICON[c.slug] || 'i-tool'} />
              </span>
              <div className="fname">
                <span className="ext">{s.license}</span>
                {s.name}{s.version ? ` ${s.version}` : ''}
              </div>
              <a className="dlbtn" href={`/sw/${s.cat}/${s.slug}/`} target="_blank" rel="noopener">
                <IconDown />{s.vendor} 공식 배포처에서 받기
              </a>
              <p className="dlnote">
                파일은 저희가 보관하지 않습니다. 누르시면 {s.vendor} 페이지가 열립니다.
              </p>
            </section>

            {/* 신뢰 정보 한 줄 — 흩어진 정보를 버튼 바로 아래 모은다. */}
            <div className="trust">
              <div><b>배포처</b><span>{s.vendor} 공식</span></div>
              <div><b>라이선스</b><span>{s.license}</span></div>
              <div>
                <b>딸려오는 프로그램</b>
                <span className={s.bundle === true ? 'warn' : ''}>
                  {s.bundle === true ? '설치 중 제안 있음' : s.bundle === false ? '없음' : '확인 안 됨'}
                </span>
              </div>
              <div><b>버전</b><span>{s.version || '표기 없음'}</span></div>
            </div>

            {s.note && (
              <div className="note">
                <span className="ni"><IconWarn /></span>
                <p><Rich text={s.note} /></p>
              </div>
            )}

            {/* 나에게 맞나 — 시안에서 새로 넣은 구간.
                맞지 않는 사람을 대안으로 빨리 보내는 편이 그냥 이탈시키는 것보다 낫다. */}
            <section>
              <h2 className="h2">이 프로그램, 나에게 맞을까요</h2>
              <div className="fit2">
                <div className="fitcol ok">
                  <h3>이런 분께 잘 맞습니다</h3>
                  <ul>
                    {s.fit.map(([t, d], i) => (
                      <li key={i}><b>{t}</b> — {d}</li>
                    ))}
                  </ul>
                </div>
                <div className="fitcol no">
                  <h3>이런 분은 다시 생각해 보세요</h3>
                  <ul>
                    {s.notFit.map(([t, d], i) => (
                      <li key={i}><b>{t}</b> — {d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* 설치 3단계 — 실제 이탈 지점(관리자 권한, SmartScreen)을 미리 처리한다. */}
            <section>
              <h2 className="h2">설치 방법</h2>
              <ol className="steps">
                <li>
                  <b>공식 배포처에서 설치 파일 받기</b>
                  위 버튼을 누르면 {s.vendor} 페이지가 열립니다. 그 페이지의 다운로드 버튼을 누르면
                  <b> 다운로드</b> 폴더에 설치 파일이 저장됩니다.
                </li>
                <li>
                  <b>파일 실행</b>
                  받은 파일을 두 번 누르고, “이 앱이 장치를 변경하도록 허용” 창에서 <b>예</b>를
                  누릅니다.
                  {s.bundle === true && (
                    <> 설치 도중 <b>다른 프로그램을 함께 설치하겠냐고 묻는 화면</b>이 나옵니다.
                    필요 없으면 체크를 풀고 다음으로 넘어가세요.</>
                  )}
                </li>
                <li>
                  <b>설치 확인</b>
                  설치가 끝나면 시작 메뉴에서 {s.name}을 찾을 수 있습니다.
                </li>
              </ol>
              <div className="note">
                <span className="ni"><IconWarn /></span>
                <p>
                  <b>“Windows에서 PC를 보호했습니다”</b> 경고가 뜨면, <b>자세히 › 실행</b>을 누르기
                  전에 발행자가 <b>{s.vendor}</b>가 맞는지 먼저 확인하세요. 발행자가 비어 있거나
                  다른 이름이면 그 파일은 실행하지 말고 지우시는 편이 안전합니다.
                </p>
              </div>
            </section>

            <div className="ad">광고 영역</div>

            <section>
              <h2 className="h2">장점과 단점</h2>
              <div className="fit2">
                <div className="fitcol ok">
                  <h3>이래서 씁니다</h3>
                  <ul>{s.pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
                </div>
                <div className="fitcol no">
                  <h3>이건 감안하세요</h3>
                  <ul>{s.cons.map((p, i) => <li key={i}>{p}</li>)}</ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="h2">프로그램 정보</h2>
              <div className="specs">
                <div><b>개발사</b><span>{s.vendor}</span></div>
                <div><b>영문 이름</b><span>{s.nameEn}</span></div>
                <div><b>라이선스</b><span>{s.license}</span></div>
                <div><b>버전</b><span>{s.version || '공식 페이지에 표기 없음'}</span></div>
                <div><b>지원 OS</b><span>{s.os.join(' · ')}</span></div>
                <div><b>한국어</b><span>{s.korean ? '지원' : '미지원'}</span></div>
              </div>
            </section>

            {s.faq && s.faq.length > 0 && (
              <section>
                <h2 className="h2">자주 묻는 질문</h2>
                <div className="faq">
                  {s.faq.map(([q, a], i) => (
                    <details key={i}>
                      <summary>{q}</summary>
                      <p><Rich text={a} /></p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {alts.length > 0 && (
              <section>
                <h2 className="h2">다른 프로그램과 비교</h2>
                <p className="sechint">
                  위에서 “다시 생각해 보세요”에 해당하셨다면 이쪽이 나을 수 있습니다.
                </p>
                <div className="tblwrap">
                  <table className="cmp">
                    <thead>
                      <tr>
                        <th>프로그램</th><th>라이선스</th><th>딸려오는 프로그램</th><th>이런 분께</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="me">
                        <td><b>{s.name}</b></td>
                        <td>{s.license}</td>
                        <td>{s.bundle === true ? '있음' : s.bundle === false ? '없음' : '확인 안 됨'}</td>
                        <td>{s.fit[0] ? s.fit[0][0] : '—'}</td>
                      </tr>
                      {alts.map((a) => (
                        <tr key={a.slug}>
                          <td><Link href={`/software/${a.cat}/${a.slug}/`}>{a.name}</Link></td>
                          <td>{a.license}</td>
                          <td>{a.bundle === true ? '있음' : a.bundle === false ? '없음' : '확인 안 됨'}</td>
                          <td>{a.fit[0] ? a.fit[0][0] : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>

          <aside className="side">
            <h3>다른 프로그램</h3>
            <div className="box">
              {rel.map((r) => (
                <Link key={r.slug} href={`/software/${r.cat}/${r.slug}/`}>
                  {r.name}
                  <span className="r">{r.license}</span>
                </Link>
              ))}
            </div>
            <p className="note2">
              모두 제작사 공식 배포처로 연결합니다. 파일을 보관하거나 다시 포장하지 않습니다.
            </p>
            <div className="ad">광고 영역</div>
          </aside>
        </div>
      </div>
    </>
  );
}
