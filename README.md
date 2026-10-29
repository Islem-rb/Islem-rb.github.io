# Islem Rebhi · Portfolio

Personal site in English (`/`) and French (`/fr`), built with Next.js 16, Tailwind CSS 4 and Motion, on top of the React Bits Pro portfolio template.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to out/
```

## Where things live

| What | File |
| --- | --- |
| Profile, projects, experience, education (English) | `lib/content.ts` |
| French versions of that content | `lib/content-fr.ts` |
| Interface text in both languages | `lib/i18n.ts` |
| Case-study diagrams and lessons (both languages) | `lib/case-studies.ts` |
| Site URL, SEO defaults | `lib/metadata.ts` (`siteConfig.url`) |
| Portraits (light / dark, photo / dither) | `public/portrait/` |
| CVs | `public/cv-en.pdf`, `public/cv-fr.pdf` |

Pages are thin wrappers: `app/(en)/…` and `app/(fr)/fr/…` both render the shared components in `components/pages/`.

## Deploy

`npm run build` writes a fully static site to `out/`. Before the first deploy, set `siteConfig.url` in `lib/metadata.ts` to the final address.

**GitHub Pages** (workflow included in `.github/workflows/deploy.yml`):

1. Push this project to the repository that should serve it. For the root address `https://islem-rb.github.io`, that is the `Islem-rb.github.io` repository (it replaces the current site).
2. In the repository: Settings → Pages → Source: **GitHub Actions**.
3. Every push to `main` builds and publishes the site.

Serving from a project repository (`islem-rb.github.io/<repo>/`) would need a `basePath`, which this setup does not use. Prefer the root repository or a custom domain.

**Vercel**: import the repository; the defaults work as-is.

**Custom domain**: add it in the host's settings (for GitHub Pages, also add a `public/CNAME` file containing the domain), then update `siteConfig.url`.

## Analytics (optional)

Cloudflare Web Analytics is free and cookieless. Create a site at dash.cloudflare.com → Web Analytics, then set its token:

- GitHub Pages: add a repository secret named `CF_ANALYTICS_TOKEN`.
- Vercel or local builds: set `NEXT_PUBLIC_CF_ANALYTICS_TOKEN`.

Without a token, no analytics script is loaded.

## Regenerating the portraits

The light and dark colour portraits were cut out of `assets/portrait-source.webp` with [rembg](https://github.com/danielgatis/rembg), brightened, and placed on a light or dark backdrop. The black-and-white hover images are ordered-dithered versions. To use a new photo, regenerate the four files in `public/portrait/`, give them new names (the short hash in each name stops browsers from showing a cached old photo), and update the paths in `lib/content.ts`.

## License

The underlying template is free to use for personal and commercial projects but may not be resold or redistributed as a template.
