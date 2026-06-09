/* ============================================================
   BRIGHTAI Micro-Interactions JS
   Scroll reveals, counter animation, skeleton removal
   ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     1. SCROLL REVEAL — IntersectionObserver
     ────────────────────────────────────────────── */
  function initScrollReveal() {
    var targets = document.querySelectorAll(
      '.bai-reveal, .bai-reveal-stagger, .bai-reveal-scale, .bai-reveal-start'
    );
    if (!targets.length) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach(function (el) {
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ──────────────────────────────────────────────
     2. NUMBER COUNTER ANIMATION
     ────────────────────────────────────────────── */
  function initCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      counters.forEach(function (el) {
        el.textContent = el.getAttribute('data-counter');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-counter'), 10);
    if (isNaN(target)) return;

    var suffix = el.getAttribute('data-counter-suffix') || '';
    var prefix = el.getAttribute('data-counter-prefix') || '';
    var duration = parseInt(el.getAttribute('data-counter-duration'), 10) || 1500;
    var start = 0;
    var startTime = null;

    // Easing: ease-out cubic
    function ease(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var value = Math.round(ease(progress) * target);

      el.textContent = prefix + formatNumber(value) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + formatNumber(target) + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  function formatNumber(n) {
    // Arabic-Indic numerals optional: use data-counter-locale="ar"
    return n.toLocaleString('en-US');
  }

  /* ──────────────────────────────────────────────
     3. SKELETON → CONTENT REPLACEMENT
     ────────────────────────────────────────────── */
  function initSkeletons() {
    var skeletons = document.querySelectorAll('[data-skeleton-load]');
    if (!skeletons.length) return;

    skeletons.forEach(function (container) {
      var delay = parseInt(container.getAttribute('data-skeleton-load'), 10) || 800;

      setTimeout(function () {
        var realContent = container.querySelector('[data-skeleton-real]');
        var skeletonContent = container.querySelector('[data-skeleton-placeholder]');

        if (skeletonContent && realContent) {
          // Fade out skeleton
          skeletonContent.style.transition = 'opacity 200ms ease';
          skeletonContent.style.opacity = '0';

          setTimeout(function () {
            skeletonContent.style.display = 'none';
            realContent.style.display = '';
            realContent.style.opacity = '0';
            realContent.style.transition = 'opacity 300ms ease';

            // Trigger reflow
            void realContent.offsetWidth;
            realContent.style.opacity = '1';
          }, 200);
        }
      }, delay);
    });
  }

  /* ──────────────────────────────────────────────
     4. SMOOTH SCROLL TO SECTIONS
     ────────────────────────────────────────────── */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var id = link.getAttribute('href').slice(1);
      if (!id) return;

      var target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      var navHeight = 80; // account for fixed nav
      var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });

      // Update URL without scroll jump
      if (history.pushState) {
        history.pushState(null, null, '#' + id);
      }
    });
  }

  /* ──────────────────────────────────────────────
     5. CARD TILT EFFECT (subtle 3D)
     ────────────────────────────────────────────── */
  function initCardTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window) return; // skip on touch

    var cards = document.querySelectorAll('[data-tilt]');
    cards.forEach(function (card) {
      card.style.transformStyle = 'preserve-3d';
      card.style.transition = 'transform 180ms ease-out';

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = ((y - centerY) / centerY) * -3; // max 3deg
        var rotateY = ((x - centerX) / centerX) * 3;

        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
      });
    });
  }

  /* ──────────────────────────────────────────────
     INIT
     ────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initScrollReveal();
      initCounters();
      initSkeletons();
      initSmoothScroll();
      initCardTilt();
    });
  } else {
    initScrollReveal();
    initCounters();
    initSkeletons();
    initSmoothScroll();
    initCardTilt();
  }
})();
