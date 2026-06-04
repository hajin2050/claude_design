'use strict';

/*
 * build.js — data/*.json 의 모든 인물을 읽어 dist/ 에 CV 사이트를 생성한다.
 *   dist/
 *     index.html            (전체 인물 목록 랜딩)
 *     styles/ scripts/ images/   (공통 자산 복사)
 *     <slug>/index.html     (인물별 CV)
 *
 * 의존성 없음:  node build.js
 */

const fs = require('fs');
const path = require('path');
const renderCV = require('./render');

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const DIST = path.join(ROOT, 'dist');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const dn = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, dn);
    else fs.copyFileSync(s, dn);
  }
}

function renderLanding(people) {
  const cards = people.map((d, i) => `      <a class="people-card" href="${d.slug}/">
        <span class="people-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="people-photo"><img src="images/${d.slug}.png" alt="${d.nameEn}" loading="lazy" /></span>
        <span class="people-info">
          <span class="people-name">${d.nameKo}<em> ${d.nameEn}</em></span>
          <span class="people-role">${d.role}</span>
        </span>
        <span class="people-arrow">→</span>
      </a>`).join('\n');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Trainer CV — Index</title>
  <meta name="description" content="퍼스널 트레이너 CV 모음." />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700;800&display=swap">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" />
  <link rel="stylesheet" href="styles/main.css" />
</head>
<body class="landing">
  <header class="landing-head">
    <span class="landing-eyebrow">PERSONAL&nbsp;TRAINER&nbsp;·&nbsp;CV</span>
    <h1 class="landing-title">트레이너<br/><em>프로필.</em></h1>
    <p class="landing-sub">아래에서 트레이너를 선택해 CV 를 확인하세요.</p>
  </header>

  <main class="people-list">
${cards}
  </main>

  <footer class="landing-foot">
    <span>© 2026</span>
    <span>Trainer CV · Index</span>
    <span>Korea</span>
  </footer>
</body>
</html>
`;
}

function main() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  copyDir(path.join(ROOT, 'styles'), path.join(DIST, 'styles'));
  copyDir(path.join(ROOT, 'scripts'), path.join(DIST, 'scripts'));
  copyDir(path.join(ROOT, 'images'), path.join(DIST, 'images'));

  const files = fs.existsSync(DATA_DIR)
    ? fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json')).sort()
    : [];

  const people = [];
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
    const dir = path.join(DIST, data.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), renderCV(data));
    people.push(data);
    console.log(`  ✓ ${data.slug}/  (${data.nameKo} · ${data.nameEn})`);
  }

  fs.writeFileSync(path.join(DIST, 'index.html'), renderLanding(people));

  // 사람별 도메인 → 해당 인물 페이지를 루트로 보여주는 rewrite 자동 생성.
  // (vercel.json 은 Vercel 이 빌드 전에 읽으므로 저장소에 커밋되어야 한다.
  //  build 를 로컬에서 돌려 갱신·커밋하면 됨. 멱등이라 재실행해도 동일.)
  const rewrites = people
    .filter((p) => p.domain)
    .map((p) => ({
      source: '/',
      has: [{ type: 'host', value: p.domain }],
      destination: `/${p.slug}`,
    }));
  const config = {
    buildCommand: 'node build.js',
    outputDirectory: 'dist',
    cleanUrls: true,
    trailingSlash: false,
  };
  if (rewrites.length) config.rewrites = rewrites;
  fs.writeFileSync(path.join(ROOT, 'vercel.json'), `${JSON.stringify(config, null, 2)}\n`);

  console.log(`\nBuilt ${people.length} CV page(s) → dist/`);
  if (rewrites.length) {
    console.log('Domains:');
    for (const p of people.filter((x) => x.domain)) console.log(`  ${p.domain}  →  /${p.slug}`);
  }
}

main();
