# TODO

Everything here is missing from `content/cv.md`. Nothing has been invented to fill the gaps;
each item is shown as a yellow dashed `TODO` badge in the UI until it's resolved.

## Content (needs input from Islem)

- [ ] **GitOps EKS Platform: exact repo URL.** cv.md only gives `https://github.com/Islem-rb`.
      Set `repo:` in `src/content/projects/gitops-eks-platform.md`. (UI: card + detail page)
- [ ] **DevOps Observability Platform: exact repo URL.** Same as above.
      `src/content/projects/devops-observability-platform.md`.
- [ ] **CityVoice: exact repo URL.** Same as above. `src/content/projects/cityvoice.md`.
- [ ] **Carnova: repo URL.** cv.md has no repo for this project (it may be private; if so,
      remove the TODO in the UI). `src/content/projects/carnova.md`.
- [ ] **Measurable results for every project** (e.g. pipeline duration, rollout strategy, alert
      count, cost). cv.md has no metrics. Shown in the "Results" block on each detail page;
      text is `todos.metrics` in `src/data/site.ts`.
- [ ] **Open Graph preview image** (1200×630) for link previews on LinkedIn and Slack. Add it under
      `public/` and an `og:image` tag in `src/layouts/BaseLayout.astro` (currently omitted
      rather than faked).
- [ ] **ESPRIT location:** cv.md says "Tunis, Tunisia" in the header and "Ariana, Tunisia" in
      Education. Both are shown as written; confirm which one you want.

## Already in place

- `public/cv.pdf` is present (linked from the header, hero and footer).

## Optional

- [ ] Screenshots or Grafana dashboards for the project detail pages.
- [ ] A custom domain (add `public/CNAME` and update `site` in `astro.config.mjs`).
