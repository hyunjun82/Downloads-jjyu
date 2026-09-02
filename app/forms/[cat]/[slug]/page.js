import Link from 'next/link';
import { notFound } from 'next/navigation';
import Crumb from '../../../../components/Crumb';
import Rich, { RichLines } from '../../../../components/Rich';
import CopyButton from '../../../../components/CopyButton';
import Checklist from '../../../../components/Checklist';
import {
  DocIcon, IconDown, IconEye, IconFile, IconWarn,
} from '../../../../components/Icons';
import {
  FORMS, getCategory, getForm, getExample, related, plain, josa, SITE_URL,
} from '../../../../lib/forms';

export function generateStaticParams() {
  return FORMS.map((f) => ({ cat: f.cat, slug: f.slug }));
}

export function generateMetadata({ params }) {
  const f = getForm(params.cat, params.slug);
  if (!f) return {};
  const c = getCategory(f.cat);
  // ⚠️ 설명(description)에 작성 예시의 내용을 절대 넣지 않는다.
  //    검색결과에서 예시가 그대로 보이면 사용자는 들어올 이유가 없어진다(제로클릭).
  //    설명은 "여기 오면 무엇이 있는지"까지만 적고, 내용은 페이지 안에서 보여준다.
  // 이 서식에 실제로 있는 것만 적는다. 없는 것을 적으면 들어와서 바로 나간다.
  const has = [];
  if (getExample(f.cat, f.slug)) has.push('항목별 작성 방법');
  if (f.checklist) has.push('제출 전 확인 목록');
  if (f.faq) has.push('자주 묻는 질문');
  // '일반 서식'은 발행 기관 이름이 아니라 아직 확인하지 못했다는 표시다.
  // 기관인 척 쓰지 않는다.
  const src = f.issuer === '일반 서식'
    ? `공개된 ${f.ext} 표준 서식 원본으로 연결`
    : `${josa(f.issuer)} 배포하는 ${f.ext} 원본으로 연결`;
  const desc = has.length
    ? `${plain(f.summary)} ${src}하고, ${has.join('·')}을 함께 정리했습니다.`
    : `${plain(f.summary)} ${src}합니다.`;

  return {
    title: `${f.title} 양식 다운로드${f.hasExample ? ' · 작성 예시' : ''}`,
    description: desc,
    alternates: { canonical: `/forms/${f.cat}/${f.slug}/` },
    openGraph: {
      title: `${f.title} 양식 다운로드`,
      url: `${SITE_URL}/forms/${f.cat}/${f.slug}/`,
      type: 'article',
    },
  };
}

export default function FormDetail({ params }) {
  const f = getForm(params.cat, params.slug);
  if (!f) notFound();
  const c = getCategory(f.cat);
  const ex = getExample(f.cat, f.slug);
  const rel = related(f.cat, f.slug);
  const url = `${SITE_URL}/forms/${f.cat}/${f.slug}/`;

  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '홈', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: '서류·양식', item: `${SITE_URL}/forms/` },
        { '@type': 'ListItem', position: 3, name: c.name, item: `${SITE_URL}/forms/${c.slug}/` },
        { '@type': 'ListItem', position: 4, name: f.title, item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <div className="top">
        <div className="wrap">
          <Crumb items={[
            { name: '홈', href: '/' },
            { name: '서류·양식', href: '/forms/' },
            { name: c.name, href: `/forms/${c.slug}/` },
            { name: f.title },
          ]} />
          <div className="head">
            <span className="ci"><DocIcon /></span>
            <div>
              <h1>{f.title} 양식{f.hasExample ? '과 작성 예시' : ''}</h1>
              <div className="srcline">
                <span className="badge k">{f.ext}</span>
                <span className="badge">{f.issuer}</span>
                <span className="badge">무료</span>
                <span className="badge num">{f.checked} 확인</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap body" style={{ padding: '34px 0' }}>
        <div className="layout">
          <div className="art">
            <section>
              <h2>{f.title}은 어떤 서류인가요</h2>
              {(f.intro || [f.summary]).map((p, i) => (
                <p key={i}><Rich text={p} /></p>
              ))}
            </section>

            {ex && (
              <section>
                <h2>이렇게 쓰면 됩니다</h2>
                <p><Rich text={ex.lead} /></p>

                <div className="examtag"><IconFile w={1.8} />{ex.tag}</div>

                <div className="exam">
                  <div className="doct">{ex.docTitle}</div>

                  {ex.rows.map(([l, v], i) => (
                    <div className="r" key={i}>
                      <span className="l">{l}</span>
                      <span className="c"><RichLines text={v} /></span>
                    </div>
                  ))}

                  {ex.blocks.map((b, i) => (
                    <div key={i}>
                      <div className="hd2">
                        {b.h}
                        {b.copy && <CopyButton text={b.copy} />}
                      </div>
                      {b.p && b.p.map((t, j) => <div key={j}><Rich text={t} /></div>)}
                      {b.ol && (
                        <ol>{b.ol.map((t, j) => <li key={j}><Rich text={t} /></li>)}</ol>
                      )}
                    </div>
                  ))}

                  <div className="sign">
                    {ex.sign.map((t, i) => (
                      <span key={i}>{i > 0 && <br />}<Rich text={t} /></span>
                    ))}
                  </div>
                  <div className="to"><Rich text={ex.to} /></div>
                </div>

                <p className="caption">
                  위 내용은 작성 방법을 보여주기 위한 예시입니다. 실제 인물이나 사건과 관계가 없습니다.
                </p>

                {ex.tips.map(([h, t], i) => (
                  <div key={i}>
                    <h3>{h}</h3>
                    <p><Rich text={t} /></p>
                  </div>
                ))}

                {ex.warn && (
                  <div className="note">
                    <span className="ni"><IconWarn /></span>
                    <p><Rich text={ex.warn} /></p>
                  </div>
                )}
              </section>
            )}

            {f.checklist && (
              <section id="chk">
                <h2>내기 전에 확인하세요</h2>
                <p>
                  서식은 한 번에 다 채우기 어렵습니다. 체크한 내용은 이 브라우저에 저장되니 나중에
                  다시 오셔도 그대로 남아 있습니다.
                </p>
                <Checklist id={`${f.cat}/${f.slug}`} items={f.checklist} />
              </section>
            )}

            {ex && ex.submit && (
              <section>
                <h2>어디에, 언제 내나요</h2>
                {ex.submit.map(([h, t], i) => (
                  <div key={i}>
                    <h3 style={i === 0 ? { marginTop: 0 } : undefined}>{h}</h3>
                    <p><Rich text={t} /></p>
                  </div>
                ))}
              </section>
            )}

            {f.fields && (
              <section>
                <h2>양식에 들어가는 항목</h2>
                <div className="tbl">
                  {f.fields.map(([k, v], i) => (
                    <div key={i}><span className="k">{k}</span><span className="v">{v}</span></div>
                  ))}
                </div>
              </section>
            )}

            {f.faq && (
              <section>
                <h2>자주 묻는 질문</h2>
                {f.faq.map(([q, a], i) => (
                  <div key={i}>
                    <h3 style={i === 0 ? { marginTop: 0 } : undefined}>{q}</h3>
                    <p><Rich text={a} /></p>
                  </div>
                ))}
              </section>
            )}

            <div className="ad">광고 영역</div>

            {rel.length > 0 && (
              <section>
                <h2>함께 찾는 서식</h2>
                <div className="rel">
                  {rel.map((r) => (
                    <Link className="rcard" key={r.slug} href={`/forms/${r.cat}/${r.slug}/`}>
                      <span className="ci"><DocIcon /></span>
                      <span>
                        <span className="nm">{r.title}</span>
                        <span className="sr">{r.issuer}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h3 style={{ marginTop: 0 }}>참고해 주세요</h3>
              <p style={{ marginBottom: 0 }}>
                이 페이지는 서식을 찾고 쓰는 데 도움을 드리려고 정리한 안내이며 법률 자문이 아닙니다.
                구체적인 사건은 변호사나 대한법률구조공단(국번 없이 132)에 상담하시기 바랍니다.
                서식 파일은 저희가 보관하지 않고 발행 기관 페이지로 연결합니다.
              </p>
            </section>
          </div>

          {/* 내려받기 */}
          <div className="dlcard">
            <div className="thumbwrap">
              <div className="thumb">
                <div className="t">{f.title}</div>
                <u /><u className="m" /><u /><u className="s" />
                <u /><u className="m" /><u /><u className="s" /><u className="m" />
              </div>
            </div>
            <div className="dlbody">
              <div className="fname">
                <span className="ext">{f.ext}</span>
                {(ex && ex.file) || `${f.title}_표준양식.${f.ext.toLowerCase()}`}
              </div>
              <a className="dlbtn" href={f.url} target="_blank" rel="noopener nofollow">
                <IconDown />{f.title} 다운로드
              </a>
              {ex && (
                <a className="subbtn" href="#chk"><IconEye />제출 전 확인하기</a>
              )}
              <div className="dlmeta">
                <div><dt>형식</dt><dd>{f.ext}</dd></div>
                <div><dt>요금</dt><dd>무료</dd></div>
                <div><dt>발행</dt><dd>{f.issuerShort || f.issuer}</dd></div>
              </div>
              <div className="dlnote">
                파일을 저희가 보관하지 않습니다.<br />{f.issuer} 페이지로 이동합니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
