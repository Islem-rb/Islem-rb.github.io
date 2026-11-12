import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { profile } from "./content";
import { getDictionary, type Lang } from "./i18n";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function ogAlt(lang: Lang): string {
  return `${profile.name}, ${getDictionary(lang).meta.ogTagline}`;
}

// Small text uses Noto: Archivo draws "&" like an 8 at small sizes.
// The site's colours (light theme), so a shared link looks like the site.
const C = {
  paper: "#eceee7",
  surface: "#f6f7f2",
  ink: "#0f1a26",
  muted: "#4f5b67",
  border: "#cfd4ca",
  grid: "rgba(15,26,38,0.06)",
  accent: "#d9431f",
  cloud: "#1d5bc0",
  product: "#7637d0",
  ai: "#b86e00",
  signal: "#187a45",
};

const asset = (name: string): Buffer => readFileSync(join(process.cwd(), "lib/og", name));

/** Points around the portrait: a small piece of the home page map. */
const POINTS: { deg: number; c: string }[] = [
  { deg: -90, c: C.cloud },
  { deg: -40, c: C.cloud },
  { deg: 0, c: C.cloud },
  { deg: 40, c: C.product },
  { deg: 90, c: C.product },
  { deg: 140, c: C.ai },
  { deg: 180, c: C.ai },
  { deg: -140, c: C.product },
];

export function renderOgImage(lang: Lang): ImageResponse {
  const t = getDictionary(lang);
  const portrait = `data:image/png;base64,${asset("portrait.png").toString("base64")}`;
  const cx = 230;
  const cy = 230;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: C.paper,
          backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
          color: C.ink,
          fontFamily: "Archivo",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                border: `2.5px solid ${C.ink}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: 5, background: C.accent }} />
            </div>
            <span style={{ fontFamily: "Archivo Expanded" }}>{profile.name}</span>
            <span style={{ color: C.muted, fontFamily: "Noto" }}>/ {t.nav.role}</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Archivo Expanded",
              fontSize: 60,
              lineHeight: 1.04,
              letterSpacing: -2.5,
              maxWidth: 700,
            }}
          >
            <span>
              {t.hero.line1} {t.hero.line2}
            </span>
            <span style={{ color: C.accent }}>{t.hero.emphasis}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 24 }}>
            <span style={{ color: C.muted, fontFamily: "Noto", fontSize: 21 }}>{t.meta.ogTagline}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 12, fontWeight: 600 }}>
              <span style={{ width: 12, height: 12, borderRadius: 6, background: C.signal }} />
              {t.contact.available}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", position: "relative", width: 460, height: 460, marginTop: 20 }}>
          <div
            style={{
              position: "absolute",
              left: cx - 215,
              top: cy - 215,
              width: 430,
              height: 430,
              borderRadius: 215,
              border: `1.5px dashed ${C.border}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: cx - 150,
              top: cy - 150,
              width: 300,
              height: 300,
              borderRadius: 150,
              border: `1.5px solid ${C.border}`,
            }}
          />
          {POINTS.map((p) => {
            const x = cx + 150 * Math.cos((p.deg * Math.PI) / 180);
            const y = cy + 150 * Math.sin((p.deg * Math.PI) / 180);
            return (
              <div
                key={p.deg}
                style={{
                  position: "absolute",
                  left: x - 13,
                  top: y - 13,
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  border: `3px solid ${p.c}`,
                  background: C.surface,
                }}
              />
            );
          })}
          <img
            src={portrait}
            width={170}
            height={170}
            alt=""
            style={{
              position: "absolute",
              left: cx - 85,
              top: cy - 85,
              borderRadius: 85,
              border: `4px solid ${C.accent}`,
            }}
          />
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Archivo", data: asset("archivo-regular.ttf"), weight: 400, style: "normal" },
        { name: "Archivo", data: asset("archivo-semibold.ttf"), weight: 600, style: "normal" },
        { name: "Archivo Expanded", data: asset("archivo-expanded-bold.ttf"), weight: 700, style: "normal" },
        { name: "Noto", data: asset("noto-sans.ttf"), weight: 400, style: "normal" },
      ],
    },
  );
}
