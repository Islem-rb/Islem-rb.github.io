// Language helpers. English is the default at /, French lives under /fr/ (astro.config.mjs i18n).
// UI text is in en.json / fr.json; fr.json must have the same shape as en.json.
import { getRelativeLocaleUrl } from 'astro:i18n';
import { getCollection, type CollectionEntry } from 'astro:content';
import en from './en.json';
import fr from './fr.json';

export const languages = ['en', 'fr'] as const;
export type Lang = (typeof languages)[number];
export type Dict = typeof en;

const dicts: Record<Lang, Dict> = { en, fr };

export const toLang = (locale: string | undefined): Lang => (locale === 'fr' ? 'fr' : 'en');
export const getDict = (lang: Lang) => dicts[lang];
export const otherLang = (lang: Lang): Lang => (lang === 'en' ? 'fr' : 'en');

// '/about' -> '/fr/about' for French; '/' stays '/' in English and becomes '/fr/'.
export const localize = (lang: Lang, route = '/') => getRelativeLocaleUrl(lang, route.replace(/^\//, ''));

// Route without the language prefix: '/fr/projects/x' -> '/projects/x'.
export const unlocalize = (pathname: string) => pathname.replace(/^\/fr(?=\/|$)/, '') || '/';

// CV per language (public/cv-en.pdf, public/cv-fr.pdf) and the file name it downloads as.
export const cv: Record<Lang, { href: string; file: string }> = {
  en: { href: '/cv-en.pdf', file: 'Islem_Rebhi_CV_EN.pdf' },
  fr: { href: '/cv-fr.pdf', file: 'Islem_Rebhi_CV_FR.pdf' },
};

// Projects of one language, flagship first.
export const getProjects = async (lang: Lang) =>
  (await getCollection(lang === 'fr' ? 'projectsFr' : 'projects')).sort((a, b) => a.data.order - b.data.order);

// Static paths for /projects/[slug] in one language; each page also links to the next project.
export type ProjectProps = { project: CollectionEntry<'projects'>; index: number; next: CollectionEntry<'projects'> };
export const projectPaths = async (lang: Lang) => {
  const projects = (await getProjects(lang)) as CollectionEntry<'projects'>[];
  return projects.map((project, i) => ({
    params: { slug: project.id },
    props: { project, index: i, next: projects[(i + 1) % projects.length] } satisfies ProjectProps,
  }));
};
