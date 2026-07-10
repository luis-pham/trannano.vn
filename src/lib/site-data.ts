import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const DEFAULT_SETTINGS = {
  id: "singleton",
  businessName: "Nội Thất Tài Đức",
  phone: "0986.979.353",
  zaloUrl: null as string | null,
  address: null as string | null,
  workingHours: "Nhận điện thoại 24/7",
  serviceAreas: "Ninh Bình, Thanh Hoá, Hà Nam",
  mapEmbedUrl: null as string | null,
  facebookUrl: null as string | null,
  googleBusinessUrl: null as string | null,
  defaultMetaTitle: "Trannano.vn - Nội Thất Tài Đức | Chuyên Thi Công Trần Nano",
  defaultMetaDescription:
    "Nội Thất Tài Đức (Trannano.vn) chuyên thi công trần nhựa nano, ốp tường nhựa, lát sàn nhựa giả gỗ tại Ninh Bình, Thanh Hoá, Hà Nam. Báo giá miễn phí tận nơi, bảo hành dài hạn.",
  defaultOgImage: "/images/hero.jpg",
};

async function loadSiteSettings() {
  try {
    const existing = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    if (existing) return existing;
    return await prisma.siteSettings.create({
      data: { id: "singleton", defaultOgImage: "/images/hero.jpg" },
    });
  } catch (e) {
    console.error("loadSiteSettings: database unavailable", e);
    return DEFAULT_SETTINGS;
  }
}

async function loadPublicNav() {
  try {
    const [services, locations] = await Promise.all([
      prisma.service.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        select: { slug: true, title: true },
      }),
      prisma.location.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        select: { slug: true, title: true },
      }),
    ]);
    return { services, locations };
  } catch (e) {
    console.error("loadPublicNav: database unavailable", e);
    return { services: [], locations: [] };
  }
}

const cachedSettings = unstable_cache(loadSiteSettings, ["site-settings"], {
  revalidate: 120,
  tags: ["site-settings"],
});

const cachedNav = unstable_cache(loadPublicNav, ["public-nav"], {
  revalidate: 120,
  tags: ["services", "locations"],
});

/** Deduped per-request + cached across requests (2 phút) */
export const getSiteSettings = cache(() => cachedSettings());

export const getPublicNavData = cache(() => cachedNav());
