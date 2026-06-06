/* BrightAI Kernel PWA registration, install prompt, and notification helpers */
(function () {
  'use strict';

  const SW_URL = '/kernel/sw.js';
  const SW_SCOPE = '/kernel/';
  const INSTALL_DISMISSED_KEY = 'brightai_kernel_install_banner_dismissed';
  const LAST_PENDING_KEY = 'brightai_kernel_last_pending_count';
  let deferredInstallPrompt = null;
  let pendingCheckTimer = null;

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE }).catch(() => {});
    });
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    showInstallBanner();
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    dismissInstallBanner();
  });

  document.addEventListener('DOMContentLoaded', () => {
    showInstallBanner();
    initPendingApprovalNotifications();
  });

  function showInstallBanner() {
    if (!deferredInstallPrompt) return;
    if (localStorage.getItem(INSTALL_DISMISSED_KEY) === 'true') return;
    if (document.getElementById('kernel-install-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'kernel-install-banner';
    banner.className = 'kernel-install-banner';
    banner.setAttribute('role', 'status');
    banner.innerHTML = `
      <div class="kernel-install-banner__content">
        <strong>تثبيت BrightAI Kernel</strong>
        <span>شغّل لوحة الحوكمة كتطبيق سريع مع دعم offline.</span>
      </div>
      <div class="kernel-install-banner__actions">
        <button type="button" class="kernel-install-banner__button" id="kernel-install-action">تثبيت</button>
        <button type="button" class="kernel-install-banner__dismiss" id="kernel-install-dismiss" aria-label="إخفاء">×</button>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById('kernel-install-action')?.addEventListener('click', installKernelApp);
    document.getElementById('kernel-install-dismiss')?.addEventListener('click', () => {
      localStorage.setItem(INSTALL_DISMISSED_KEY, 'true');
      dismissInstallBanner();
    });
  }

  async function installKernelApp() {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice.catch(() => null);
    deferredInstallPrompt = null;
    dismissInstallBanner();
    await requestNotificationSupport();
  }

  function dismissInstallBanner() {
    document.getElementById('kernel-install-banner')?.remove();
  }

  async function requestNotificationSupport() {
    if (!('Notification' in window) || Notification.permission === 'denied') return;
    if (Notification.permission === 'default') {
      await Notification.requestPermission().catch(() => null);
    }
    await subscribeToPushNotifications();
  }

  async function subscribeToPushNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    const publicKey = window.BrightAIKernelPushPublicKey;
    if (!publicKey) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      await fetch('/api/kernel/push-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      }).catch(() => null);
    } catch (_error) {
      // Push subscription support is optional until the backend provides a VAPID key.
    }
  }

  function initPendingApprovalNotifications() {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
    if (Notification.permission === 'default') {
      document.addEventListener('click', requestNotificationSupport, { once: true });
    } else if (Notification.permission === 'granted') {
      subscribeToPushNotifications();
    }

    checkPendingApprovalCount();
    pendingCheckTimer = window.setInterval(checkPendingApprovalCount, 60000);
    window.addEventListener('beforeunload', () => {
      if (pendingCheckTimer) window.clearInterval(pendingCheckTimer);
    });
  }

  async function checkPendingApprovalCount() {
    if (!navigator.onLine || Notification.permission !== 'granted') return;

    try {
      const response = await fetch('/api/kernel/approvals', { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      const count = Number(data.summary?.totalPending ?? data.total ?? data.pending?.length ?? 0) || 0;
      const lastCount = Number(localStorage.getItem(LAST_PENDING_KEY) || '0') || 0;
      localStorage.setItem(LAST_PENDING_KEY, String(count));

      if (count > lastCount && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_PENDING_APPROVAL_NOTIFICATION',
          count
        });
      }
    } catch (_error) {
      // Offline API fallback is handled by the service worker.
    }
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; i += 1) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }
})();
