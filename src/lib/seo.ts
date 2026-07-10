import type { Metadata } from "next";
import { prisma } from "./prisma";
import { BRAND_LOGO } from "./brand";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trannano.vn";

export function getSiteUrl() {
  return SITE_URL.replace(/\/$/, "");
}

/** Resolve relative paths like /images/x.png to absolute URL for OG tags */
export function absoluteUrl(pathOrUrl?: string | null): string | undefined {
  if (!pathOrUrl?.trim()) return undefined;
  const value = pathOrUrl.trim();
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  const base = getSiteUrl();
  return `${base}${value.startsWith("/") ? value : `/${value}`}`;
}

export async function getSiteSettings() {
  return prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      defaultOgImage: "/images/hero.jpg",
    },
  });
}

function withBrandSuffix(title: string) {
  if (title.includes(BRAND_LOGO)) return title;
  return `${title} | ${BRAND_LOGO}`;
}

type BuildMetaInput = {
  title?: string | null;
  description?: string | null;
  ogImage?: string | null;
  path: string;
  fallbackTitle?: string | null;
  fallbackDescription?: string | null;
  fallbackImage?: string | null;
};

export async function buildMetadata({
  title,
  description,
  ogImage,
  path,
  fallbackTitle,
  fallbackDescription,
  fallbackImage,
}: BuildMetaInput): Promise<Metadata> {
  const settings = await getSiteSettings();
  const finalTitle = title?.trim()
    ? withBrandSuffix(title.trim())
    : fallbackTitle?.trim()
      ? withBrandSuffix(fallbackTitle.trim())
      : settings.defaultMetaTitle;

  const finalDescription =
    description?.trim() ||
    fallbackDescription?.trim() ||
    settings.defaultMetaDescription;

  const finalImage =
    absoluteUrl(ogImage) ||
    absoluteUrl(fallbackImage) ||
    absoluteUrl(settings.defaultOgImage || "/images/hero.jpg");

  const url = `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  return {
    // absolute: tránh bị root layout template gắn thêm "| Trannano.vn"
    title: { absolute: finalTitle },
    description: finalDescription,
    alternates: { canonical: url },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url,
      siteName: BRAND_LOGO,
      locale: "vi_VN",
      type: "website",
      ...(finalImage ? { images: [{ url: finalImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      ...(finalImage ? { images: [finalImage] } : {}),
    },
  };
}

export function phoneTel(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function zaloLink(phone: string, zaloUrl?: string | null) {
  if (zaloUrl) return zaloUrl;
  const digits = phone.replace(/\D/g, "");
  return `https://zalo.me/${digits}`;
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

/** Convert Maps share / short links to a usable iframe embed URL when possible */
export function toMapEmbedUrl(url?: string | null): string | null {
  if (!url?.trim()) return null;
  const value = url.trim();
  if (value.includes("/maps/embed") || value.includes("output=embed")) return value;
  // Known business pin from Google Business short link
  if (value.includes("maps.app.goo.gl/WZ7Mh8CeyY5Frvxw6") || value.includes("goo.gl/WZ7Mh8CeyY5Frvxw6")) {
    return "https://www.google.com/maps?q=19.9949165,105.485175&z=10&hl=vi&output=embed";
  }
  const coord = value.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (coord) {
    return `https://www.google.com/maps?q=${coord[1]},${coord[2]}&z=12&hl=vi&output=embed`;
  }
  if (value.includes("google.com/maps")) {
    const sep = value.includes("?") ? "&" : "?";
    return `${value}${sep}output=embed`;
  }
  return value;
}
