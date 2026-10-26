// WCAG 2.x contrast check for the theme tokens in src/styles/global.css.
// Usage: node scripts/contrast.mjs   (exits 1 if a pair fails its target)
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const block = (re) => Object.fromEntries([...css.match(re)[1].matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
const light = block(/@theme \{([\s\S]*?)\n\}/);
const dark = { ...light, ...block(/:root\[data-theme="dark"\] \{([\s\S]*?)\n\}/) };
// Particle opacities (Particles.astro) from the :root blocks.
const alphas = (re) => {
  const body = css.match(re)[1];
  const get = (name) => Number(body.match(new RegExp(`--particle-${name}:\\s*([\\d.]+)`))[1]);
  // Under text, both opacities are scaled by the text fade.
  const fade = get('text-fade');
  return { dot: get('dot-alpha') * fade, line: get('line-alpha') * fade, color: body.match(/--particle-color:\s*(#[0-9a-f]{6})/i)[1] };
};
light.particles = alphas(/\n:root \{([\s\S]*?)\n\}/);
dark.particles = alphas(/:root\[data-theme="dark"\] \{([\s\S]*?)\n\}/);

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

// Worst case under text that sits directly on the page: a dot with a line crossing it.
const particleAlpha = ({ dot, line }) => 1 - (1 - dot) * (1 - line);

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
    ...['fg', 'muted', 'accent'].flatMap((k) =>
      ['bg-from', 'bg-to'].map((b) => {
        const under = mix(t.particles.color, t[b], particleAlpha(t.particles));
        return [k, t[k], `particle on ${b}`, under, 4.5];
      }),
    ),
    ['line (UI)', t.line, 'surface', t.surface, 1.2],
    ['muted (UI, icons)', t.muted, 'surface', t.surface, 3],
  ];
  for (const [a, ca, b, cb, target] of pairs) {
    const r = ratio(ca, cb);
    const ok = r >= target;
    if (!ok) failed = true;
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1  ${a} ${ca} on ${b} ${cb}  (target ${target})`);
  }
  // Visibility only (no target): a dot over empty background, at full strength.
  const fade = Number(css.match(name === 'light' ? /\n:root \{[\s\S]*?--particle-text-fade:\s*([\d.]+)/ : /data-theme="dark"\] \{[\s\S]*?--particle-text-fade:\s*([\d.]+)/)[1]);
  for (const b of ['bg-from', 'bg-to']) {
    const dot = mix(t.particles.color, t[b], t.particles.dot / fade);
    console.log(`  info  ${ratio(dot, t[b]).toFixed(2).padStart(5)}:1  particle dot (open area) on ${b}`);
  }
}
process.exit(failed ? 1 : 0);
