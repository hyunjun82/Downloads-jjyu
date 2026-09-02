# 다운로드 인덱스 (downloads.jjyu.co.kr)

서식·프로그램을 **공식 배포처로 연결**하는 정적 사이트. 파일은 직접 보관하지 않는다.

## 실행

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # out/ 에 정적 파일 생성
```

## 배포

Cloudflare Pages. `wrangler.jsonc` 의 `assets.directory` 가 `./out` 이다.
`html_handling: auto-trailing-slash` 이므로 모든 주소가 `/`로 끝난다.

## 구조

```
data/forms.json      서식 목록 · 분류
data/examples.json   작성 예시 (본문의 주인공. 서식 하나당 한 덩어리)
lib/forms.js         조회 · NFC 정규화 · 조사 · 본문 표기 변환
app/                 페이지
components/          공용 조각. 'use client' 는 복사·체크·검색 세 개뿐
```

## 반드시 지킬 것

**1. 한글 경로는 NFC.**
`lib/forms.js` 의 `nfc()` 를 거치지 않은 slug 를 쓰지 않는다.
macOS 는 한글을 NFD 로 저장하고 리눅스·윈도우는 NFC 를 쓴다. 겉보기엔 같은
"고소장" 이라도 바이트가 달라서, 빌드한 파일명과 링크가 어긋나 404 가 난다.
Next 가 라우트 파라미터를 퍼센트 인코딩된 채로 넘겨줄 때도 있어서
`nfc()` 안에서 디코딩까지 함께 처리한다.

**2. 설명(description)에 작성 예시 내용을 넣지 않는다.**
검색결과에 예시가 그대로 보이면 들어올 이유가 없어진다(제로클릭).
설명은 "여기 오면 무엇이 있는지"까지만 적는다.
`app/forms/[cat]/[slug]/page.js` 의 `generateMetadata` 주석 참고.

**3. 없는 것을 있다고 적지 않는다.**
`generateMetadata` 는 그 서식에 실제로 있는 것(작성 예시·확인 목록·FAQ)만
설명에 적는다. `일반 서식` 은 발행 기관 이름이 아니라 아직 확인하지 못했다는
표시이므로 기관인 척 쓰지 않는다.

**4. 색은 파랑 하나.**
분류색은 홈의 카테고리 카드에서만 쓴다. 목록·상세는 파랑과 회색뿐이다.

**5. 광고는 위쪽 여백을 아래보다 크게.**
모바일은 위에서 아래로 내려오며 누른다. `.ad` 의 `margin: 48px auto 30px`
를 줄이지 않는다.

## 현재 범위

법률·소송 9건까지 넣고 빌드·배포까지 한 번 관통시킨 상태다.
나머지 분류와 프로그램·드라이버·폰트는 이 틀 위에 데이터를 얹으면 된다.
