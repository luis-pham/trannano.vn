import { getSiteUrl } from "./seo";
import { BRAND_LOGO, BRAND_TAGLINE } from "./brand";

/** Thứ tự chuẩn theo SEO_SPEC — luôn đủ 3 tỉnh */
export const CANONICAL_SERVICE_AREAS = ["Ninh Bình", "Thanh Hoá", "Hà Nam"] as const;

export function normalizeAreaServed(serviceAreas?: string | null): string[] {
  const fromSettings = (serviceAreas || "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  const normalized = fromSettings.map((a) =>
    a
      .replace(/Thanh\s*Hóa/i, "Thanh Hoá")
      .replace(/Ninh\s*Binh/i, "Ninh Bình")
      .replace(/Ha\s*Nam/i, "Hà Nam")
  );

  const result: string[] = [];
  for (const area of CANONICAL_SERVICE_AREAS) {
    const found = normalized.find(
      (a) => a.localeCompare(area, "vi", { sensitivity: "base" }) === 0 || a.includes(area.split(" ")[0])
    );
    result.push(found || area);
  }
  // Luôn trả đúng 3 tỉnh theo thứ tự chuẩn
  return [...CANONICAL_SERVICE_AREAS];
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

export type BreadcrumbItem = { name: string; href?: string };

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.href ? { item: `${base}${item.href}` } : {}),
    })),
  };
}

export function buildLocalBusinessJsonLd(settings: {
  businessName: string;
  phone: string;
  address?: string | null;
  defaultOgImage?: string | null;
  serviceAreas: string;
  facebookUrl?: string | null;
  googleBusinessUrl?: string | null;
  zaloUrl?: string | null;
}) {
  const areas = normalizeAreaServed(settings.serviceAreas);

  const sameAs = [
    settings.facebookUrl,
    settings.googleBusinessUrl,
    settings.zaloUrl,
  ].filter((u): u is string => Boolean(u?.trim()));

  const image = settings.defaultOgImage?.trim()
    ? settings.defaultOgImage.startsWith("http")
      ? settings.defaultOgImage
      : `${getSiteUrl()}${settings.defaultOgImage.startsWith("/") ? "" : "/"}${settings.defaultOgImage}`
    : `${getSiteUrl()}/images/hero.jpg`;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${getSiteUrl()}/#localbusiness`,
    name: settings.businessName,
    alternateName: BRAND_LOGO,
    description: BRAND_TAGLINE,
    telephone: settings.phone,
    url: getSiteUrl(),
    image,
    areaServed: areas.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  };

  if (sameAs.length > 0) data.sameAs = sameAs;

  if (settings.address?.trim()) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressCountry: "VN",
    };
  }

  return data;
}

export function buildServiceJsonLd(
  service: {
    title: string;
    slug?: string;
    shortDescription?: string | null;
  },
  businessName: string,
  serviceAreas?: string | null
) {
  const areas = normalizeAreaServed(serviceAreas);
  const url = service.slug
    ? `${getSiteUrl()}/dich-vu/${service.slug}`
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    ...(url ? { "@id": `${url}#service`, url, name: service.title } : { name: service.title }),
    serviceType: service.title,
    areaServed: areas.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    provider: {
      "@type": "HomeAndConstructionBusiness",
      "@id": `${getSiteUrl()}/#localbusiness`,
      name: businessName,
    },
    description: service.shortDescription || service.title,
  };
}

export function buildServiceItemListJsonLd(
  services: { title: string; slug: string; shortDescription?: string | null }[],
  businessName: string,
  serviceAreas?: string | null
) {
  const areas = normalizeAreaServed(serviceAreas);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Dịch vụ thi công trần nhựa nano, sàn nhựa",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        "@id": `${getSiteUrl()}/dich-vu/${service.slug}#service`,
        name: service.title,
        url: `${getSiteUrl()}/dich-vu/${service.slug}`,
        serviceType: service.title,
        description: service.shortDescription || service.title,
        areaServed: areas.map((name) => ({
          "@type": "AdministrativeArea",
          name,
        })),
        provider: {
          "@type": "HomeAndConstructionBusiness",
          "@id": `${getSiteUrl()}/#localbusiness`,
          name: businessName,
        },
      },
    })),
  };
}

export function buildLocationServiceJsonLd(
  location: { title: string; slug: string },
  businessName: string,
  serviceAreas?: string | null
) {
  const areas = normalizeAreaServed(serviceAreas);
  const url = `${getSiteUrl()}/khu-vuc/${location.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: `Thi công trần nhựa nano tại ${location.title}`,
    url,
    serviceType: "Thi công trần nhựa nano, ốp tường, lát sàn nhựa",
    description: `Dịch vụ thi công trần nhựa nano, ốp tường nhựa, lát sàn nhựa giả gỗ tại ${location.title} và khu vực lân cận.`,
    areaServed: areas.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    provider: {
      "@type": "HomeAndConstructionBusiness",
      "@id": `${getSiteUrl()}/#localbusiness`,
      name: businessName,
    },
  };
}

export function buildFaqPageJsonLd(faqs: { question: string; answer: string }[]) {
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: stripHtml(faq.answer),
      },
    })),
  };
}

export function buildBlogPostingJsonLd(
  post: {
    title: string;
    excerpt?: string | null;
    coverImage?: string | null;
    publishedAt: Date | string;
    slug: string;
  },
  businessName: string
) {
  const image = post.coverImage
    ? post.coverImage.startsWith("http")
      ? post.coverImage
      : `${getSiteUrl()}${post.coverImage}`
    : `${getSiteUrl()}/images/hero.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    image,
    datePublished: new Date(post.publishedAt).toISOString(),
    author: { "@type": "Organization", name: businessName },
    publisher: {
      "@type": "Organization",
      name: businessName,
      "@id": `${getSiteUrl()}/#localbusiness`,
    },
    mainEntityOfPage: `${getSiteUrl()}/blog/${post.slug}`,
  };
}
