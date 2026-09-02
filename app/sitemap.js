import { CATEGORIES, FORMS, SITE_URL } from '../lib/forms';

// 한글 경로는 사이트맵에 반드시 퍼센트 인코딩으로 적는다.
// 구글 사이트맵 규격이 URL 이스케이프를 요구하고, 한글 그대로 두면 무시되는 경우가 있다.
const u = (p) => `${SITE_URL}${p.split('/').map(encodeURIComponent).join('/')}`;

// output:'export' 에서는 사이트맵도 빌드 때 한 번 만들고 끝낸다고 알려 줘야 한다.
export const dynamic = 'force-static';

export default function sitemap() {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/forms/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    ...CATEGORIES.map((c) => ({
      url: u(`/forms/${c.slug}/`), lastModified: now, changeFrequency: 'weekly', priority: 0.8,
    })),
    ...FORMS.map((f) => ({
      url: u(`/forms/${f.cat}/${f.slug}/`),
      lastModified: new Date(f.checked),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
  ];
}
