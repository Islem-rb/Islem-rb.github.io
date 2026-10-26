// WCAG 2.x contrast check for the theme tokens in src/styles/global.css.
// Usage: node scripts/contrast.mjs   (exits 1 if a pair fails its target)
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const block = (re) => Object.fromEntries([...css.match(re)[1].matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
const light = block(/@theme \{([\s\S]*?)\n\}/);
const dark = { ...light, ...block(/:root\[data-theme="dark"\] \{([\s\S]*?)\n\}/) };

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const lum = (hex) => {
  const [r, g, b] = rgb(hex).map((v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
// Badge background: 10% of the TODO color over the page background.
const mix = (a, b, t) => '#' + rgb(a).map((v, i) => Math.round(v * t + rgb(b)[i] * (1 - t)).toString(16).padStart(2, '0')).join('');

let failed = false;
for (const [name, t] of [['light', light], ['dark', dark]]) {
  console.log(`\n${name}`);
  const pairs = [
    ['fg', t.fg, 'bg-from', t['bg-from'], 4.5],
    ['fg', t.fg, 'bg-to', t['bg-to'], 4.5],
    ['muted', t.muted, 'bg-from', t['bg-from'], 4.5],
    ['muted', t.muted, 'bg-to', t['bg-to'], 4.5],
    ['muted', t.muted, 'surface', t.surface, 4.5],
    ['accent', t.accent, 'bg-from', t['bg-from'], 4.5],
    ['accent', t.accent, 'bg-to', t['bg-to'], 4.5],
    ['accent', t.accent, 'surface', t.surface, 4.5],
    ['accent', t.accent, 'surface-2', t['surface-2'], 4.5],
    ['accent-ink', t['accent-ink'], 'accent', t.accent, 4.5],
    ['todo', t.todo, 'todo badge', mix(t.todo, t['bg-to'], 0.1), 4.5],
    ['line (UI)', t.line, 'surface', t.surface, 1.2],
    ['muted (UI, icons)', t.muted, 'surface', t.surface, 3],
  ];
  for (const [a, ca, b, cb, target] of pairs) {
    const r = ratio(ca, cb);
    const ok = r >= target;
    if (!ok) failed = true;
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1  ${a} ${ca} on ${b} ${cb}  (target ${target})`);
  }
}
process.exit(failed ? 1 : 0);
