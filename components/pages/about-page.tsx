import { FileDown } from "lucide-react";
import type { ReactNode } from "react";

import { Education } from "@/components/about/education";
import { Experience } from "@/components/about/experience";
import { Skills, Toolbox } from "@/components/about/skills";
import { Stack } from "@/components/about/stack";
import { FadeIn } from "@/components/ui/motion-primitives";
import { getLanguages, profile } from "@/lib/content";
import { getDictionary, type Lang } from "@/lib/i18n";

function B({ children }: { children: ReactNode }): ReactNode {
  return <strong className="font-semibold text-foreground">{children}</strong>;
}

const BIO: Record<Lang, { hello: string; paragraphs: ReactNode[] }> = {
  en: {
    hello: "Hello! I’m",
    paragraphs: [
      <>
        A <B>Cloud &amp; DevOps engineering student</B> at ESPRIT in Ariana,
        Tunisia. I started out writing applications: Spring Boot APIs, Angular
        and React front ends, a React Native app for visually impaired users.
        Somewhere along the way I got more curious about what happens{" "}
        <B>after the code is merged</B>.
      </>,
      <>
        Today I work on <B>platform engineering</B>: Terraform modules instead
        of console clicks, Argo CD instead of manual deploys, signed and
        scanned images, and dashboards and alerts that tell you something is
        wrong before users do. I&rsquo;ve built this from a private OpenStack
        cloud up to a GitOps platform on EKS.
      </>,
      <>
        I&rsquo;m looking for a{" "}
        <B>PFE internship in Cloud, DevOps or Platform Engineering</B>, in
        Tunisia or Europe, with a team that ships often and cares about doing
        it safely.
      </>,
    ],
  },
  fr: {
    hello: "Bonjour ! Je suis",
    paragraphs: [
      <>
        <B>Étudiant ingénieur Cloud &amp; DevOps</B> à ESPRIT, à Ariana en
        Tunisie. J&rsquo;ai commencé par écrire des applications : des API
        Spring Boot, des interfaces Angular et React, une application React
        Native pour les personnes malvoyantes. En chemin, je me suis
        intéressé à ce qui se passe <B>une fois le code fusionné</B>.
      </>,
      <>
        Aujourd&rsquo;hui, je fais du <B>platform engineering</B> : des
        modules Terraform plutôt que des clics dans la console, Argo CD plutôt
        que des déploiements manuels, des images signées et scannées, et des
        tableaux de bord et alertes qui signalent un problème avant les
        utilisateurs. Je l&rsquo;ai mis en pratique d&rsquo;un cloud privé
        OpenStack jusqu&rsquo;à une plateforme GitOps sur EKS.
      </>,
      <>
        Je cherche un{" "}
        <B>stage PFE en Cloud, DevOps ou Platform Engineering</B>, en Tunisie
        ou en Europe, dans une équipe qui livre souvent et qui tient à le
        faire en sécurité.
      </>,
    ],
  },
};

function Facts({ lang }: { lang: Lang }): ReactNode {
  const t = getDictionary(lang).about;
  const otherLang: Lang = lang === "en" ? "fr" : "en";
  const rows: { label: string; value: ReactNode }[] = [
    { label: t.basedIn, value: profile.location },
    { label: t.studying, value: t.studyingValue },
    { label: t.lookingFor, value: t.lookingForValue },
    {
      label: t.languages,
      value: getLanguages(lang)
        .map((l) => `${l.name} (${l.level.toLowerCase()})`)
        .join(", "),
    },
    {
      label: t.emailLabel,
      value: (
        <a
          href={`mailto:${profile.email}`}
          className="focus-ring rounded-sm underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-foreground"
        >
          {profile.email}
        </a>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <h2 className="eyebrow">{t.factsTitle}</h2>
      <div className="sheet flex flex-col p-1">
        <dl className="flex flex-col divide-y divide-border px-4 sm:px-5">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 py-3.5">
              <dt className="text-[12.5px] text-muted-foreground">
                {row.label}
              </dt>
              <dd className="text-[15px] leading-normal text-foreground">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-2 border-t border-border px-4 py-4 sm:px-5">
          <a
            href={profile.cv[lang]}
            download
            className="focus-ring inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background"
          >
            <FileDown className="h-4 w-4" aria-hidden="true" />
            {t.cvPrimary}
          </a>
          <a
            href={profile.cv[otherLang]}
            download
            lang={otherLang}
            className="focus-ring inline-flex h-11 items-center gap-2 rounded-md border border-foreground/25 px-4 text-sm font-medium text-foreground transition-colors hover:border-foreground"
          >
            <FileDown className="h-4 w-4" aria-hidden="true" />
            {t.cvSecondary}
          </a>
        </div>
      </div>
    </div>
  );
}

export function AboutPage({ lang }: { lang: Lang }): ReactNode {
  const bio = BIO[lang];
  const t = getDictionary(lang);

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-310 px-5 pt-32 sm:px-8 sm:pt-40">
        <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <FadeIn>
            <p className="eyebrow">{t.nav.about}</p>
            <h1 className="mt-5 font-serif text-[2.4rem] leading-[1.02] font-semibold tracking-[-0.04em] text-balance text-foreground sm:text-[3.4rem]">
              {bio.hello} {profile.name}
              <span className="text-accent">.</span>
            </h1>
            <div className="mt-8 max-w-[62ch] space-y-5 text-[17px] leading-[1.7] text-foreground/80 sm:text-[18px]">
              {bio.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="flex flex-col gap-8">
            <figure className="sheet p-1.5">
              <img
                src={profile.portrait.light}
                alt={profile.name}
                width={640}
                height={640}
                className="aspect-[4/3] w-full rounded-sm object-cover object-[50%_20%] dark:hidden"
              />
              <img
                src={profile.portrait.dark}
                alt={profile.name}
                width={640}
                height={640}
                className="hidden aspect-[4/3] w-full rounded-sm object-cover object-[50%_20%] dark:block"
              />
              <figcaption className="flex items-center justify-between px-2.5 pt-2.5 pb-1 text-[13px] text-muted-foreground">
                <span className="font-medium text-foreground">{profile.name}</span>
                <span>{profile.location}</span>
              </figcaption>
            </figure>
            <Facts lang={lang} />
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto w-full max-w-310 px-5 pt-20 sm:px-8 sm:pt-28">
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-12">
          <FadeIn delay={0.1} className="lg:col-span-7">
            <Experience />
          </FadeIn>
          <FadeIn delay={0.15} className="lg:col-span-5">
            <Education lang={lang} />
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-12">
            <Stack />
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-5">
            <Skills lang={lang} />
          </FadeIn>
          <FadeIn delay={0.15} className="lg:col-span-7">
            <Toolbox lang={lang} />
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
