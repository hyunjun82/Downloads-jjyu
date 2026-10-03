import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DocIcon, IconDown, IconWarn } from '../../../../components/Icons';
import { FORMS, getCategory, getForm, getExample } from '../../../../lib/forms';

// 서식용 중간 페이지. /sw/(프로그램) · /dv/(드라이버) 와 같은 이유로 둔다.
// 애드센스 전면광고는 '같은 사이트' 안의 페이지 이동에서 뜬다.
// 상세에서 곧장 기관 사이트로 나가면 외부 도메인이라 광고가 낄 자리가 없다.
//
// 주소를 ?target= 쿼리로 받지 않고 정적 경로 + 데이터(forms.json)에서 꺼내는 이유:
// 쿼리로 받으면 아무 URL이나 실어 보낼 수 있는 오픈 리다이렉트가 된다.
// 이 사이트가 피싱 링크의 발판으로 쓰일 수 있다. 경로는 forms.json 에 있는 것만 통과한다.
export function generateStaticParams() {
  return FORMS.map((f) => ({ cat: f.cat, slug: f.slug }));
}

export function generateMetadata({ params }) {
  const f = getForm(params.cat, params.slug);
  if (!f) return {};
  return {
    title: `${f.title} 내려받기`,
    robots: { index: false, follow: true },
    alternates: { canonical: `/forms/${f.cat}/${f.slug}/` },
  };
}

export default function FormGo({ params }) {
  const f = getForm(params.cat, params.slug);
  if (!f) notFound();
  const c = getCategory(f.cat);
  const ex = getExample(f.cat, f.slug);

  return (
    <div className="wrap" style={{ padding: '44px 0 60px' }}>
      <div className="golay">
        <div className="gocard">
          <span className="goci" style={{ background: c.bg }}><DocIcon /></span>
          <h1>{f.title} 양식</h1>
          <div className="srcline" style={{ justifyContent: 'center' }}>
            <span className="badge k">{f.ext}</span>
            <span className="badge">{f.issuer}</span>
            <span className="badge">무료</span>
          </div>

          <div className="fname" style={{ marginTop: 18 }}>
            <span className="ext">{f.ext}</span>
            {(ex && ex.file) || `${f.title}.${f.ext.toLowerCase()}`}
          </div>

          {f.post ? (
            // 기관이 파일을 GET 주소가 아니라 POST 로만 내려주는 경우(예: 영업비밀보호센터).
            // 외부로 폼을 보내면 브라우저가 응답 파일을 그대로 저장하고 이 페이지는 그대로 남는다.
            <form method="post" action={f.post.action}>
              {Object.entries(f.post.fields).map(([k, v]) => (
                <input key={k} type="hidden" name={k} value={v} />
              ))}
              <button className="dlbtn" type="submit">
                <IconDown />{f.issuer} 원본 내려받기
              </button>
            </form>
          ) : (
            <a className="dlbtn" href={f.url} rel="nofollow">
              <IconDown />{f.issuer} 원본 내려받기
            </a>
          )}

          <p className="dlnote" style={{ borderTop: 'none', marginTop: 14, paddingTop: 0 }}>
            파일은 저희가 보관하지 않습니다. {f.issuer} 서버에서 바로 내려받습니다.
          </p>
        </div>


        <div className="art" style={{ maxWidth: 640, margin: '0 auto' }}>
          <div className="note">
            <span className="ni"><IconWarn /></span>
            <p>
              내려받은 뒤 <b>{f.ext} 파일을 열 수 있는 프로그램</b>이 필요합니다.
              제출 전에 작성 방법과 확인 목록은 아래 링크에서 볼 수 있습니다.
            </p>
          </div>
          <p style={{ textAlign: 'center', marginBottom: 0 }}>
            <Link href={`/forms/${f.cat}/${f.slug}/`}>← {f.title} 작성 방법 다시 보기</Link>
            {'  ·  '}
            <Link href={`/forms/${c.slug}/`}>{c.name} 더 보기</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
