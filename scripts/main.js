/* ==========================================================================
   AI Studio Portfolio — Interactions
   ========================================================================== */

(() => {
  'use strict';

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  const loaderCount = document.getElementById('loaderCount');
  const loaderBar = document.getElementById('loaderBar');
  let progress = 0;

  const loaderTick = setInterval(() => {
    progress += Math.random() * 12 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loaderTick);
      setTimeout(() => {
        loader.classList.add('is-done');
        document.body.style.overflow = '';
        triggerHeroEntrance();
      }, 350);
    }
    loaderCount.textContent = Math.floor(progress);
    loaderBar.style.width = progress + '%';
  }, 90);

  document.body.style.overflow = 'hidden';

  /* ---------- Custom Cursor ---------- */
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  let mouseX = 0, mouseY = 0;
  let cx = 0, cy = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateCursor() {
    cx += (mouseX - cx) * 0.18;
    cy += (mouseY - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, summary, [data-card], [data-project]').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById('nav');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
    lastY = y;
  });

  /* ---------- Hero entrance ---------- */
  function triggerHeroEntrance() {
    const title = document.querySelector('.hero-title');
    if (title) title.classList.add('is-in');

    // Animate stat counters
    document.querySelectorAll('.stat-num').forEach((el) => {
      const target = parseInt(el.dataset.count || '0', 10);
      const duration = 1600;
      const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(target * eased);
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll('[data-reveal]');
  revealTargets.forEach((el, i) => el.style.setProperty('--i', i % 6));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

  revealTargets.forEach((el) => io.observe(el));

  /* ---------- Project hover parallax (subtle) ---------- */
  document.querySelectorAll('[data-project]').forEach((project) => {
    const screen = project.querySelector('.project-screen');
    if (!screen) return;
    project.addEventListener('mousemove', (e) => {
      const rect = project.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      screen.style.transform = `translate(${x * 14}px, ${y * 10 - 4}px)`;
    });
    project.addEventListener('mouseleave', () => {
      screen.style.transform = '';
    });
  });

  /* ---------- FAQ: close others when opening one ---------- */
  const faqs = document.querySelectorAll('[data-faq]');
  faqs.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqs.forEach((other) => { if (other !== item) other.open = false; });
      }
    });
  });

  /* ---------- Smooth anchor highlight (active link) ---------- */
  const links = document.querySelectorAll('[data-link]');
  const sections = Array.from(links).map((l) => document.querySelector(l.getAttribute('href')));

  const linkIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        links.forEach((l) => {
          l.style.color = l.getAttribute('href') === id ? 'var(--paper)' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach((s) => s && linkIo.observe(s));

  /* ---------- Magnetic effect on CTAs ---------- */
  document.querySelectorAll('.nav-cta, .contact-cta').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.15;
      const y = (e.clientY - r.top - r.height / 2) * 0.15;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ---------- Build card mouse-tracking glow ---------- */
  document.querySelectorAll('[data-card]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });
})();
