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
4. `npm run build` → `dist/` 에 페이지 생성.

배포(Vercel)는 push 하면 자동으로 `node build.js` 를 돌려 `dist/` 를 서빙한다.

- 전체 목록(랜딩): `/`
- 개인 CV: `/<slug>`

## 로컬 미리보기

```
npm run build
npx serve dist     # 또는 dist/index.html 을 브라우저로 열기
```
