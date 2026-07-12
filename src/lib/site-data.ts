import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { BRAND_ADDRESS } from "@/lib/brand";

export const DEFAULT_HERO_IMAGES = '["/images/hero-banner.png"]';

export const DEFAULT_SETTINGS = {
  id: "singleton",
  businessName: "Nội Thất Tài Đức",
  phone: "0986.979.353",
  zaloUrl: null as string | null,
  address: BRAND_ADDRESS,
  workingHours: "Nhận điện thoại 24/7",
  serviceAreas: "Ninh Bình, Thanh Hoá, Hà Nam",
  mapEmbedUrl: null as string | null,
  facebookUrl: null as string | null,
  googleBusinessUrl: null as string | null,
  heroImages: DEFAULT_HERO_IMAGES,
  defaultMetaTitle: "Trannano.vn - Nội Thất Tài Đức | Chuyên Thi Công Trần Nano",
  defaultMetaDescription:
    "Nội Thất Tài Đức (Trannano.vn) chuyên thi công trần nhựa nano, ốp tường nhựa, lát sàn nhựa giả gỗ tại Ninh Bình, Thanh Hoá, Hà Nam. Báo giá miễn phí tận nơi, bảo hành dài hạn.",
  defaultOgImage: "/images/hero.jpg",
};

/** Deduped per request — không dùng unstable_cache để tránh cache rỗng khi DB lỗi tạm thời */
export const getSiteSettings = cache(async () => {
  try {
    const existing = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    if (existing) {
      return {
        ...existing,
        address: existing.address?.trim() || BRAND_ADDRESS,
        heroImages: existing.heroImages?.trim() || DEFAULT_HERO_IMAGES,
      };
    }
    return await prisma.siteSettings.create({
      data: {
        id: "singleton",
        defaultOgImage: "/images/hero.jpg",
        address: BRAND_ADDRESS,
        heroImages: DEFAULT_HERO_IMAGES,
      },
    });
  } catch (e) {
    console.error("getSiteSettings: database unavailable", e);
    return DEFAULT_SETTINGS;
  }
});

export const getPublicNavData = cache(async () => {
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
    console.error("getPublicNavData: database unavailable", e);
    return { services: [], locations: [] };
  }
});
