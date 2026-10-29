import { LANGS } from "@/lib/i18n";
import { renderOgImage } from "@/lib/og-image";

// Prerendered at build time as /og/en.png and /og/fr.png.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): { file: string }[] {
  return LANGS.map((lang) => ({ file: `${lang}.png` }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ file: string }> },
): Promise<Response> {
  const { file } = await params;
  return renderOgImage(file.startsWith("fr") ? "fr" : "en");
}
