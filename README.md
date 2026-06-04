# Trainer CV

데이터 기반 트레이너 CV 정적 사이트. **사람별 데이터(JSON)만 추가하면 CV 페이지가 자동 생성**됩니다.

## 구조

```
data/<slug>.json     ← 사람별 내용 (이것만 추가/수정하면 됨)
images/<slug>.png    ← 사람별 프로필 사진
render.js            ← CV 한 명 분량 HTML 템플릿 (디자인 공통 관리)
build.js             ← 전체 빌드 → dist/
styles/ scripts/     ← 공통 디자인 자산
dist/                ← 생성 결과 (배포 대상, git 추적 안 함)
```

## 새 인물 추가하는 법

1. `data/jiho-yoon.json` 을 복사해 `data/<새-slug>.json` 으로 만든다.
2. 내용(이름·경력·자격 등)을 채운다. `slug` 값은 파일명과 같게.
3. 프로필 사진을 `images/<slug>.png` 로 넣는다.
4. (도메인 쓸 경우) `domain` 필드에 그 사람 도메인을 적는다. 예: `"domain": "jihocv.vercel.app"`
5. `npm run build` → `dist/` 생성 + `vercel.json` rewrite 자동 갱신. 커밋·push.

## 도메인 (사람마다 다른 주소)

저장소·빌드는 하나로 두고, **Vercel 한 프로젝트에 도메인을 여러 개** 붙인 뒤
각 도메인이 자기 사람 페이지를 루트로 보여주도록 rewrite 한다. 이 rewrite 는
`data/*.json` 의 `domain` 값으로부터 `build.js` 가 `vercel.json` 에 자동 생성한다.

**Vercel 쪽 1회 설정 (사람 추가할 때마다 도메인만):**
1. Vercel 프로젝트 → Settings → **Domains** → 그 사람 도메인 추가
   (예: `jihocv.vercel.app` — 사용 가능한 이름이어야 함)
2. 끝. 라우팅은 저장소의 `vercel.json` 이 처리.

- 개인 도메인: `jihocv.vercel.app` → 윤지호 CV (루트)
- 전체 목록(랜딩): 프로젝트 기본 도메인 `/`
- 경로로도 접근 가능: `<기본도메인>/<slug>`

## 로컬 미리보기

```
npm run build
npx serve dist     # 또는 dist/index.html 을 브라우저로 열기
```
