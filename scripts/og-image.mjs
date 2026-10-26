// Renders scripts/og-template.html to public/og.png (1200x630) for link previews.
// Usage: node scripts/og-image.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';

const template = new URL('./og-template.html', import.meta.url);
const out = fileURLToPath(new URL('../public/og.png', import.meta.url));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(template.href);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out });
await browser.close();
console.log(`wrote ${out}`);
