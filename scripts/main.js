/* ==========================================================================
   Studio Portfolio — Minimal Interactions
   ========================================================================== */

(() => {
  'use strict';

  // Lock body briefly, then run intro
  document.body.style.overflow = 'hidden';
  const intro = document.getElementById('intro');

  window.addEventListener('load', () => {
    setTimeout(() => {
      intro && intro.classList.add('is-done');
      document.body.style.overflow = '';
      triggerHero();
    }, 1300);
  });

  function triggerHero() {
    const title = document.querySelector('.hero-title');
    if (title) title.classList.add('is-in');
  }

  // Nav scroll state
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }, { passive: true });

  // Reveal on scroll
  const revealTargets = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

  revealTargets.forEach((el, i) => {
    el.style.transitionDelay = ((i % 4) * 80) + 'ms';
    io.observe(el);
  });

  // FAQ: close others on open
  const faqs = document.querySelectorAll('[data-faq]');
  faqs.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqs.forEach((other) => { if (other !== item) other.open = false; });
      }
    });
  });

  // Active section in nav
  const links = document.querySelectorAll('[data-link]');
  const sections = Array.from(links).map((l) => document.querySelector(l.getAttribute('href')));
  const linkIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        links.forEach((l) => {
          const isActive = l.getAttribute('href') === id;
          l.style.color = isActive ? 'var(--accent)' : '';
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => s && linkIo.observe(s));
})();
