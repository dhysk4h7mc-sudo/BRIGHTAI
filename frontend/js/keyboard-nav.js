/* ============================================================
   BRIGHTAI Keyboard Navigation JS
   Focus management, keyboard shortcuts, tab trapping
   ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     1. KEYBOARD SHORTCUTS
     ────────────────────────────────────────────── */
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
      var isInput = ['INPUT', 'TEXTAREA', 'SELECT'].indexOf(e.target.tagName) !== -1;

      // Skip shortcuts when typing in inputs
      if (isInput) return;

      // ⌘K / Ctrl+K — Open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
        return;
      }

      // ⌘/ — Open keyboard help (only if a trigger exists)
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        toggleKeyboardHelp();
        return;
      }

      // Escape — Close modals, drawers, dropdowns
      if (e.key === 'Escape') {
        closeTopmost();
        return;
      }
    });
  }

  function openSearch() {
    var searchInput = document.querySelector('.search-input, #search-input, [role="search"] input');
    if (searchInput) {
      searchInput.focus();
    }
  }

  function toggleKeyboardHelp() {
    var helpPanel = document.querySelector('#bai-keyboard-help');
    if (!helpPanel) return;
    var isHidden = helpPanel.getAttribute('aria-hidden') !== 'false';
    helpPanel.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
    if (isHidden) {
      helpPanel.querySelector('button, [tabindex]').focus();
    }
  }

  function closeTopmost() {
    // Close chat widget
    var chatBox = document.querySelector('#bai-chat-box.is-open, .chat-box.is-open');
    if (chatBox) {
      chatBox.classList.remove('is-open');
      var chatFab = document.querySelector('#bai-chat-fab, .chat-fab');
      if (chatFab) chatFab.focus();
      return;
    }

    // Close mobile drawer
    var drawer = document.querySelector('.mobile-menu-drawer.active');
    if (drawer) {
      drawer.classList.remove('active');
      var toggle = document.querySelector('.mobile-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
      return;
    }

    // Close modal
    var modal = document.querySelector('.bai-modal-backdrop[aria-hidden="false"]');
    if (modal) {
      modal.setAttribute('aria-hidden', 'true');
      var trigger = document.querySelector('[data-modal-trigger][aria-expanded="true"]');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
      return;
    }

    // Close dropdown
    var dropdown = document.querySelector('.bai-dropdown-trigger[aria-expanded="true"]');
    if (dropdown) {
      dropdown.setAttribute('aria-expanded', 'false');
      dropdown.focus();
    }
  }

  /* ──────────────────────────────────────────────
     2. FOCUS TRAP FOR MODALS
     ────────────────────────────────────────────── */
  function initFocusTraps() {
    document.querySelectorAll('[data-focus-trap]').forEach(function (container) {
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          if (m.attributeName === 'aria-hidden') {
            var isHidden = container.getAttribute('aria-hidden') === 'true';
            if (!isHidden) {
              trapFocus(container);
            } else {
              releaseFocus(container);
            }
          }
        });
      });
      observer.observe(container, { attributes: true, attributeFilter: ['aria-hidden'] });
    });
  }

  var previousFocus = null;

  function trapFocus(container) {
    previousFocus = document.activeElement;
    var focusable = container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusable.length) {
      focusable[0].focus();
    }

    container._focusHandler = function (e) {
      if (e.key !== 'Tab') return;

      var list = container.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!list.length) return;

      var first = list[0];
      var last = list[list.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener('keydown', container._focusHandler);
  }

  function releaseFocus(container) {
    if (container._focusHandler) {
      container.removeEventListener('keydown', container._focusHandler);
      container._focusHandler = null;
    }
    if (previousFocus && previousFocus.focus) {
      previousFocus.focus();
      previousFocus = null;
    }
  }

  /* ──────────────────────────────────────────────
     3. ROVING TABINDEX FOR TAB LISTS
     ────────────────────────────────────────────── */
  function initRovingTabs() {
    document.querySelectorAll('[role="tablist"]').forEach(function (tablist) {
      var tabs = tablist.querySelectorAll('[role="tab"]');
      if (!tabs.length) return;

      // Set up initial tabindex
      tabs.forEach(function (tab, i) {
        tab.setAttribute('tabindex', i === 0 ? '0' : '-1');
      });

      tablist.addEventListener('keydown', function (e) {
        var tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
        var current = tabs.indexOf(document.activeElement);
        if (current === -1) return;

        var next = -1;

        // Arrow key navigation
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          // In RTL, ArrowRight goes previous, ArrowLeft goes next
          var isRTL = tablist.closest('[dir="rtl"]') !== null || document.documentElement.dir === 'rtl';

          if (e.key === 'ArrowRight') {
            next = isRTL ? current - 1 : current + 1;
          } else {
            next = isRTL ? current + 1 : current - 1;
          }
        } else if (e.key === 'Home') {
          next = 0;
        } else if (e.key === 'End') {
          next = tabs.length - 1;
        }

        if (next === -1) return;
        e.preventDefault();

        // Wrap around
        if (next < 0) next = tabs.length - 1;
        if (next >= tabs.length) next = 0;

        // Update tabindexes
        tabs.forEach(function (t) { t.setAttribute('tabindex', '-1'); });
        tabs[next].setAttribute('tabindex', '0');
        tabs[next].focus();

        // Activate if Enter/Space
      });

      // Activate on Enter/Space
      tablist.addEventListener('click', function (e) {
        var tab = e.target.closest('[role="tab"]');
        if (!tab) return;

        var tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
        tabs.forEach(function (t) {
          t.setAttribute('tabindex', '-1');
          t.setAttribute('aria-selected', 'false');
        });
        tab.setAttribute('tabindex', '0');
        tab.setAttribute('aria-selected', 'true');
      });
    });
  }

  /* ──────────────────────────────────────────────
     4. VISIBLE FOCUS INDICATOR CLASS
     Adds .using-keyboard to body when Tab is pressed
     ────────────────────────────────────────────── */
  function initFocusVisibility() {
    var usingKeyboard = false;

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        usingKeyboard = true;
        document.body.classList.add('using-keyboard');
        document.body.classList.remove('using-mouse');
      }
    });

    document.addEventListener('mousedown', function () {
      usingKeyboard = false;
      document.body.classList.add('using-mouse');
      document.body.classList.remove('using-keyboard');
    });

    document.addEventListener('touchstart', function () {
      usingKeyboard = false;
      document.body.classList.add('using-mouse');
      document.body.classList.remove('using-keyboard');
    });
  }

  /* ──────────────────────────────────────────────
     INIT
     ────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initKeyboardShortcuts();
      initFocusTraps();
      initRovingTabs();
      initFocusVisibility();
    });
  } else {
    initKeyboardShortcuts();
    initFocusTraps();
    initRovingTabs();
    initFocusVisibility();
  }
})();
