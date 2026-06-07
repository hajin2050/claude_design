'use strict';

/*
 * render.js — CV 한 명 분량의 HTML 페이지를 데이터 객체로부터 생성한다.
 * 디자인은 여기 한 곳에서만 관리하고, 사람별 내용은 data/*.json 으로 분리한다.
 * (*_html 필드는 직접 작성하는 신뢰된 데이터이므로 HTML 을 그대로 허용한다.)
 */

// 히어로 타이틀: 줄 단위 배열, 각 단어 {t, i:이탤릭, p:마침표강조, sp:앞공백}
function heroWords(line) {
  return line.map((w) => {
    const cls = w.i ? ' italic' : (w.p ? ' period' : '');
    return `${w.sp ? ' ' : ''}<span class="word${cls}">${w.t}</span>`;
  }).join('');
}

// 섹션 타이틀: data-reveal 스팬 배열, {t, i}
function revealTitle(arr) {
  return arr.map((s) => `<span data-reveal${s.i ? ' class="italic"' : ''}>${s.t}</span>`).join('\n        ');
}

// 커버 대형 글자: {t, i}
function megaSpans(arr) {
  return arr.map((m) => (m.i ? `<span class="italic">${m.t}</span>` : `<span>${m.t}</span>`)).join('\n                ');
}

// 경력 카드 한 장
function careerCard(c, idx) {
  const reverse = idx % 2 === 1 ? ' project--reverse' : '';
  const meta = c.meta.map((m) => `            <div>
              <dt>${m.dt}</dt>
              <dd${m.cls ? ` class="${m.cls}"` : ''}>${m.html}</dd>
            </div>`).join('\n');

  return `      <article class="project${reverse}" data-project>
        <div class="project-cover project-cover--${c.cover}">
          <div class="cover-frame">
            <div class="cover-corner tl"></div>
            <div class="cover-corner tr"></div>
            <div class="cover-corner bl"></div>
            <div class="cover-corner br"></div>
            <div class="cover-top">
              <span class="cover-num">№&nbsp;${c.num}</span>
              <span class="cover-year">${c.year}</span>
            </div>
            <div class="cover-center">
              <div class="cover-eyebrow">${c.eyebrow}</div>
              <div class="cover-mega">
                ${megaSpans(c.mega)}
              </div>
              <div class="cover-sub">${c.coverSub}</div>
            </div>
            <div class="cover-bottom">
              <span>${c.coverBottom[0]}</span>
              <span>${c.coverBottom[1]}</span>
            </div>
          </div>
        </div>
        <div class="project-text">
          <header class="project-head">
            <div class="project-index">
              <span class="project-index-num">${c.indexNum}</span>
              <span class="project-index-tag">${c.indexTag}</span>
            </div>
            <h3 class="project-name">${c.nameHtml}</h3>
            <p class="project-sub">${c.sub}</p>
          </header>

          <dl class="project-meta">
${meta}
          </dl>
        </div>
      </article>`;
}

function serviceRow(s) {
  return `      <a class="approach-row" href="#contact">
        <span class="approach-num">${s.letter}</span>
        <span class="approach-name">${s.name}</span>
        <span class="approach-desc">${s.desc}</span>
        <span class="approach-arrow">→</span>
      </a>`;
}

function aboutCard(a) {
  const mark = a.mark ? ' about-card--mark' : '';
  return `      <div class="about-card${mark}">
        <div class="about-num">${a.num}</div>
        <div class="about-rule"></div>
        <h4>${a.h4}</h4>
        <p>${a.p}</p>
      </div>`;
}

function faqItem(f) {
  return `      <details class="faq-item" data-faq>
        <summary>
          <span class="faq-num">${f.num}</span>
          <span class="faq-q">${f.q}</span>
          <span class="faq-toggle" aria-hidden="true"></span>
        </summary>
        <p>${f.a}</p>
      </details>`;
}

function contactTitle(lines) {
  return lines.map((line) => `      <span class="line">
        ${line.map((s) => `<span data-reveal${s.i ? ' class="italic"' : ''}>${s.t}</span>`).join('\n        ')}
      </span>`).join('\n');
}

function renderCV(d) {
  const heroTitle = d.heroTitle.map((line) => `      <span class="line">${heroWords(line)}</span>`).join('\n');
  const heroIndex = d.heroIndex.map((label, i) => `        <div class="hero-index-item">
          <span class="hero-index-num">${String(i + 1).padStart(2, '0')}</span>
          <span class="hero-index-label">${label}</span>
        </div>`).join('\n');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${d.nameEn} — ${d.titleMeta}</title>
  <meta name="description" content="${d.metaDescription}" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700;800&display=swap">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" />
  <link rel="stylesheet" href="../styles/main.css" />
</head>
<body>

  <!-- Minimal brand intro -->
  <div class="intro" id="intro">
    <div class="intro-mark">
      <span class="intro-line">${d.introLine}</span>
      <span class="intro-name">${d.nameEn.replace(/ /g, '&nbsp;')}</span>
    </div>
  </div>

  <!-- Navigation -->
  <header class="nav" id="nav">
    <a href="#top" class="nav-logo">
      <span class="nav-logo-text">${d.brand}<span class="nav-logo-dot">.</span></span>
    </a>
    <nav class="nav-menu">
      <a href="#work" data-link><span class="nav-num">01</span>Career</a>
      <a href="#approach" data-link><span class="nav-num">02</span>Service</a>
      <a href="#about" data-link><span class="nav-num">03</span>Profile</a>
      <a href="#faq" data-link><span class="nav-num">04</span>FAQ</a>
      <a href="#contact" data-link><span class="nav-num">05</span>Contact</a>
    </nav>
    <a href="#contact" class="nav-cta">
      <span>${d.ctaText || '수업 문의'}</span>
    </a>
  </header>

  <!-- Hero -->
  <section id="top" class="hero">
    <div class="hero-meta">
      <div class="hero-meta-row"><span>${d.heroMetaLeft}</span></div>
      <div class="hero-meta-row"><span>${d.heroMetaRight}</span></div>
    </div>

    <h1 class="hero-title" data-split>
${heroTitle}
    </h1>

    <div class="hero-foot">
      <div class="hero-sub">
        <p>${d.heroSubHtml}</p>
      </div>

      <div class="hero-index">
${heroIndex}
      </div>
    </div>

    <div class="hero-foot-line">
      <span>(SCROLL)</span>
      <span>${d.heroFootMid}</span>
      <span>CV&nbsp;·&nbsp;2026</span>
    </div>
  </section>

  <!-- Statement strip -->
  <section class="strip">
    <div class="strip-inner">
      <p class="strip-text">${d.stripHtml}</p>
    </div>
  </section>

  <!-- Career -->
  <section id="work" class="section work">
    <div class="section-head">
      <div class="section-label">
        <span class="section-num">01 / ${d.sec1Eyebrow || 'Career'}</span>
        <span class="section-name">${d.sec1Name || 'Field experience'}</span>
      </div>
      <h2 class="section-title">
        ${revealTitle(d.careerTitle)}
      </h2>
    </div>

    <div class="project-list">

${d.careers.map(careerCard).join('\n\n')}
    </div>
  </section>

  <!-- Service -->
  <section id="approach" class="section approach">
    <div class="section-head">
      <div class="section-label">
        <span class="section-num">02 / ${d.sec2Eyebrow || 'Service'}</span>
        <span class="section-name">${d.sec2Name || 'What I coach'}</span>
      </div>
      <h2 class="section-title">
        ${revealTitle(d.serviceTitle)}
      </h2>
    </div>

    <div class="approach-list">
${d.services.map(serviceRow).join('\n')}
    </div>

    <div class="approach-foot">
      <div class="approach-foot-block">
        <div class="approach-foot-label">${d.bestFitLabel || 'Best fit'}</div>
        <ul class="approach-foot-list">
${d.bestFit.map((b) => `          <li>${b}</li>`).join('\n')}
        </ul>
      </div>
    </div>
  </section>

  <!-- Profile -->
  <section id="about" class="section about">
    <div class="section-head">
      <div class="section-label">
        <span class="section-num">03 / ${d.sec3Eyebrow || 'Profile'}</span>
        <span class="section-name">${d.sec3Name || 'Education & License'}</span>
      </div>
      <h2 class="section-title about-title">
        ${revealTitle(d.profileTitle)}
      </h2>
    </div>

    <div class="profile-portrait">
      <figure class="portrait-frame">
        <img src="../images/${d.slug}.png" alt="${d.nameEn} — 퍼스널 트레이너 프로필 사진" loading="lazy" />
        <span class="cover-corner tl"></span>
        <span class="cover-corner tr"></span>
        <span class="cover-corner bl"></span>
        <span class="cover-corner br"></span>
      </figure>
      <div class="portrait-info">
        <p class="portrait-lead">${d.portraitLeadHtml}</p>
        <dl class="portrait-meta">
          <div><dt>Name</dt><dd>${d.nameKo} · ${d.nameEn}</dd></div>
          <div><dt>Role</dt><dd>${d.role}</dd></div>
          <div><dt>Based</dt><dd>${d.based}</dd></div>
        </dl>
      </div>
    </div>

    <div class="about-grid">
${d.aboutCards.map(aboutCard).join('\n')}
    </div>
  </section>

  <!-- FAQ -->
  <section id="faq" class="section faq">
    <div class="section-head">
      <div class="section-label">
        <span class="section-num">04 / FAQ</span>
        <span class="section-name">Frequently asked</span>
      </div>
      <h2 class="section-title">
        <span data-reveal>자주 묻는</span>
        <span data-reveal class="italic">질문.</span>
      </h2>
    </div>

    <div class="faq-list">
${d.faqs.map(faqItem).join('\n')}
    </div>
  </section>

  <!-- Contact -->
  <section id="contact" class="section contact">
    <div class="contact-eyebrow">
      <span>05 / Contact</span>
      <span>Let's start</span>
    </div>

    <h2 class="contact-title">
${contactTitle(d.contactTitle)}
    </h2>

    <div class="contact-actions">
      <a href="mailto:${d.email}" class="contact-cta">
        <span class="contact-cta-label">Email</span>
        <span class="contact-cta-value">${d.email}</span>
      </a>
      <a href="${d.instagramUrl || '#'}" class="contact-cta secondary"${d.instagramUrl ? ' target="_blank" rel="noopener"' : ''}>
        <span class="contact-cta-label">Instagram</span>
        <span class="contact-cta-value">${d.instagram}</span>
      </a>
    </div>

    <dl class="contact-meta">
      <div>
        <dt>Response</dt>
        <dd>평균 24시간 내</dd>
      </div>
      <div>
        <dt>Location</dt>
        <dd>${d.based}</dd>
      </div>
      <div>
        <dt>Availability</dt>
        <dd>${d.availability || '신규 회원 모집 중'}</dd>
      </div>
    </dl>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-mark">
      ${d.brand}<span class="footer-period">.</span>
    </div>
    <div class="footer-row">
      <span>© 2026 — ${d.nameEn}</span>
      <span>${d.role} · CV</span>
      <span>${d.based}</span>
    </div>
  </footer>

  <script src="../scripts/main.js"></script>
</body>
</html>
`;
}

module.exports = renderCV;
