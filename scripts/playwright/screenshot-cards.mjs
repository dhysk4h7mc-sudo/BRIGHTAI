import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('/tmp/cards-screenshots', { recursive: true });

const browser = await chromium.launch();

// Desktop full
const desktopCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const desktopPage = await desktopCtx.newPage();
await desktopPage.goto('http://localhost:4321/design/cards/', { waitUntil: 'networkidle' });
await desktopPage.waitForTimeout(500);
await desktopPage.screenshot({ path: '/tmp/cards-screenshots/cards-desktop-full.png', fullPage: true });
await desktopPage.screenshot({ path: '/tmp/cards-screenshots/cards-desktop-fold.png', fullPage: false });

// Mobile
const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const mobilePage = await mobileCtx.newPage();
await mobilePage.goto('http://localhost:4321/design/cards/', { waitUntil: 'networkidle' });
await mobilePage.waitForTimeout(500);
await mobilePage.screenshot({ path: '/tmp/cards-screenshots/cards-mobile-full.png', fullPage: true });
await mobilePage.screenshot({ path: '/tmp/cards-screenshots/cards-mobile-fold.png', fullPage: false });

// Also capture the homepage to verify nothing regressed
const homeDesktopCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const homeDesktopPage = await homeDesktopCtx.newPage();
await homeDesktopPage.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await homeDesktopPage.waitForTimeout(500);
await homeDesktopPage.screenshot({ path: '/tmp/cards-screenshots/homepage-after.png', fullPage: false });

// Capture the solutions page where SolutionCard is used
const solPage = await desktopCtx.newPage();
await solPage.goto('http://localhost:4321/solutions/', { waitUntil: 'networkidle' });
await solPage.waitForTimeout(500);
await solPage.screenshot({ path: '/tmp/cards-screenshots/solutions-after.png', fullPage: false });

// Console errors check
const errors = [];
const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p2 = await ctx2.newPage();
p2.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`[${msg.type()}] ${msg.text()}`);
});
await p2.goto('http://localhost:4321/design/cards/', { waitUntil: 'networkidle' });
await p2.waitForTimeout(500);

await browser.close();

console.log('Screenshots:');
console.log('  /tmp/cards-screenshots/cards-desktop-full.png');
console.log('  /tmp/cards-screenshots/cards-desktop-fold.png');
console.log('  /tmp/cards-screenshots/cards-mobile-full.png');
console.log('  /tmp/cards-screenshots/cards-mobile-fold.png');
console.log('  /tmp/cards-screenshots/homepage-after.png');
console.log('  /tmp/cards-screenshots/solutions-after.png');
console.log('Console errors:', errors.length === 0 ? '0 ✅' : errors);
