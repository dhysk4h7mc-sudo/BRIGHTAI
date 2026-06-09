/* ============================================================
   BRIGHTAI Theme Toggle — Dark / Light Mode
   v1.0.0 | 2026-06-10
   Persists preference in localStorage.
   Respects system preference via prefers-color-scheme.
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'brightai-theme';
  var DARK = 'dark';
  var LIGHT = 'light';

  function getPreferredTheme() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === DARK || stored === LIGHT) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? LIGHT : DARK;
  }

  function applyTheme(theme, animate) {
    var root = document.documentElement;

    if (animate) {
      root.classList.add('bai-theme-transition');
      setTimeout(function () {
        root.classList.remove('bai-theme-transition');
      }, 350);
    }

    if (theme === LIGHT) {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }

    // Update meta theme-color
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === LIGHT ? '#f8fafc' : '#0b1220');
    }

    // Update toggle button aria labels
    var toggles = document.querySelectorAll('.bai-theme-toggle');
    toggles.forEach(function (btn) {
      btn.setAttribute('aria-label', theme === DARK ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن');
    });
  }

  function toggleTheme() {
    var current = getPreferredTheme();
    var next = current === DARK ? LIGHT : DARK;
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next, true);
  }

  // Apply theme ASAP (before DOMContentLoaded) to prevent flash
  applyTheme(getPreferredTheme(), false);

  // Bind toggle buttons
  function bindToggles() {
    var toggles = document.querySelectorAll('.bai-theme-toggle');
    toggles.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        toggleTheme();
      });
    });
  }

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? DARK : LIGHT, true);
    }
  });

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindToggles);
  } else {
    bindToggles();
  }
})();
