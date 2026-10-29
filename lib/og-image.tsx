import { ImageResponse } from "next/og";

import { profile } from "./content";
import { getDictionary, type Lang } from "./i18n";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function ogAlt(lang: Lang): string {
  return `${profile.name}, ${getDictionary(lang).meta.ogTagline}`;
}

export function renderOgImage(lang: Lang): ImageResponse {
  const t = getDictionary(lang);
  const stages = t.pipeline.stages;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#fafafa",
          color: "#0a0a0a",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 30, color: "#525252" }}>{profile.name}</div>
          <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: -2, lineHeight: 1.05 }}>
            {`${t.hero.line1} ${t.hero.line2} ${t.hero.emphasis}`}
          </div>
          <div style={{ fontSize: 28, color: "#525252" }}>{t.meta.ogTagline}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {stages.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    background: i === stages.length - 1 ? "#15803d" : "#0a0a0a",
                  }}
                />
                <div style={{ fontSize: 24, color: "#404040" }}>{s}</div>
              </div>
              {i < stages.length - 1 ? (
                <div style={{ width: 30, height: 2, background: "#d4d4d4", margin: "0 12px" }} />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    ),
    ogSize,
  );
}
