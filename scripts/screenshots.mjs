// One-off screenshot driver. Spins up Chrome via puppeteer-core (using the
// already-installed Chrome on this machine), seeds the demo state into
// localStorage so the onboarding tour stays out of the way, then captures
// each key page into public/screenshots/.

import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const CHROME =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = process.env.BASE_URL || 'http://localhost:3000';
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'screenshots');

const SHOTS = [
  { path: '/dashboard',             file: 'dashboard.png',         viewport: { width: 1440, height: 980 } },
  { path: '/dashboard/signal/sig_001', file: 'signal-detail.png',   viewport: { width: 1440, height: 1400 } },
  { path: '/dashboard/portfolio',   file: 'portfolio.png',         viewport: { width: 1440, height: 1280 } },
  { path: '/dashboard/analytics',   file: 'analytics.png',         viewport: { width: 1440, height: 1400 } },
  { path: '/dashboard/admin',       file: 'admin.png',             viewport: { width: 1440, height: 1500 } },
  { path: '/',                       file: 'landing.png',           viewport: { width: 1440, height: 980 } },
];

const STATE = {
  user: { email: 'vineet.sista@gmail.com', name: 'Vineet Sista', plan: 'pro', joinedAt: '2024-09-12' },
  viewMode: 'admin',
  demoMode: true,
  soundEnabled: false,
  liveMode: true,
  notificationsEnabled: true,
  hasSeenTour: true,
};

await mkdir(OUT_DIR, { recursive: true });

if (!existsSync(CHROME)) {
  console.error(`Chrome not found at ${CHROME}. Set CHROME_PATH env var.`);
  process.exit(1);
}

console.log(`Launching ${CHROME}…`);
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'],
});

try {
  // Warm the homepage once to make subsequent route compiles faster.
  console.log('Warming dev server…');
  const warm = await browser.newPage();
  await warm.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 180000 });
  await warm.evaluate((state) => {
    localStorage.setItem('wraith:state:v1', JSON.stringify(state));
  }, STATE);
  await warm.close();

  for (const s of SHOTS) {
    const page = await browser.newPage();
    await page.setViewport({ ...s.viewport, deviceScaleFactor: 2 });
    try {
      await page.goto(`${BASE}${s.path}`, { waitUntil: 'domcontentloaded', timeout: 180000 });
      await page.evaluate((state) => {
        localStorage.setItem('wraith:state:v1', JSON.stringify(state));
      }, STATE);
      await page.reload({ waitUntil: 'domcontentloaded', timeout: 180000 });
      await new Promise((r) => setTimeout(r, 6000));
      const file = join(OUT_DIR, s.file);
      await page.screenshot({ path: file, fullPage: false });
      console.log(`✓ ${s.path} → public/screenshots/${s.file}`);
    } catch (err) {
      console.log(`✗ ${s.path} — ${err.message}`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
