import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata, getSiteSettings } from "@/lib/seo";
import { parseImages } from "@/lib/images";
import { LOCATION_EXCERPTS } from "@/lib/local-seo";
import { getPublicNavData } from "@/lib/site-data";
import { safeQuery } from "@/lib/safe-query";
import Hero from "@/components/public/Hero";
import ServiceCard from "@/components/public/ServiceCard";
import ProjectGallery from "@/components/public/ProjectGallery";
import LocationCard from "@/components/public/LocationCard";
import FaqAccordion from "@/components/public/FaqAccordion";
import CtaSection from "@/components/public/CtaSection";
import ContactForm from "@/components/public/ContactForm";


export async function generateMetadata() {
  try {
    const page = await prisma.page.findUnique({ where: { slug: "trang-chu" } });
    return buildMetadata({
      title: page?.metaTitle,
      description: page?.metaDescription,
      ogImage: page?.ogImage,
      path: "/",
      fallbackDescription:
        page?.metaDescription ||
        "Thi công trần nhựa nano, ốp tường nhựa, lát sàn nhựa giả gỗ tại Thanh Hoá, Ninh Bình, Hà Nam. Báo giá miễn phí tận nơi.",
    });
  } catch {
    return buildMetadata({
      path: "/",
      fallbackDescription:
        "Thi công trần nhựa nano, ốp tường nhựa, lát sàn nhựa giả gỗ tại Thanh Hoá, Ninh Bình, Hà Nam. Báo giá miễn phí tận nơi.",
    });
  }
}

const usps = [
  {
    title: "Chống ẩm mốc",
    desc: "Vật liệu nhựa nano chịu nước, phù hợp khí hậu nồm ẩm miền Bắc.",
    icon: (
      <svg className="h-8 w-8 text-brand" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
  },
  {
    title: "Thi công nhanh",
    desc: "Nhà ở thông thường hoàn thiện trong 1 ngày, không bụi bặm.",
    icon: (
      <svg className="h-8 w-8 text-brand" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
      </svg>
    ),
  },
  {
    title: "Bảo hành dài hạn",
    desc: "Bảo hành 3-5 năm tuỳ hạng mục, cam kết chất lượng thi công.",
    icon: (
      <svg className="h-8 w-8 text-brand" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
    ),
  },
  {
    title: "Giá thợ trực tiếp",
    desc: "Không qua trung gian, báo giá rõ ràng, không phát sinh.",
    icon: (
      <svg className="h-8 w-8 text-brand" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
      </svg>
    ),
  },
];

export default async function HomePage() {
  const settings = await getSiteSettings();
  const nav = await getPublicNavData();

  const projects = await safeQuery(
    "home.projects",
    () =>
      prisma.project.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { location: { select: { title: true } } },
      }),
    []
  );
  const faqs = await safeQuery(
    "home.faqs",
    () =>
      prisma.faq.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        take: 5,
      }),
    []
  );

  // Dùng cùng nguồn nav đã cache (tránh query trùng + Promise.all all-or-nothing)
  const services = await safeQuery(
    "home.services",
    () =>
      prisma.service.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
    []
  );
  const locations = await safeQuery(
    "home.locations",
    () =>
      prisma.location.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
    []
  );

  // Nếu full query lỗi nhưng nav còn data — vẫn hiện card tối thiểu từ nav
  const serviceCards =
    services.length > 0
      ? services
      : nav.services.map((s) => ({
          slug: s.slug,
          title: s.title,
          shortDescription: null as string | null,
          images: "[]",
        }));
  const locationCards =
    locations.length > 0
      ? locations
      : nav.locations.map((l) => ({
          slug: l.slug,
          title: l.title,
          images: "[]",
        }));

  const projectItems = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    images: parseImages(p.images),
    locationTitle: p.location?.title,
  }));

  return (
    <>
      <Hero phone={settings.phone} />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {usps.map((usp) => (
              <div key={usp.title} className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted">
                  {usp.icon}
                </div>
                <h2 className="text-base font-semibold text-gray-900">{usp.title}</h2>
                <p className="mt-1 text-sm text-gray-600">{usp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Dịch vụ của chúng tôi</h2>
              <p className="mt-2 text-gray-600">
                Trần nhựa nano, ốp tường, sàn nhựa giả gỗ và vách trang trí.
              </p>
            </div>
            <Link href="/dich-vu" className="hidden shrink-0 text-sm font-medium text-brand hover:underline md:block">
              Xem tất cả →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCards.map((s) => (
              <ServiceCard
                key={s.slug}
                slug={s.slug}
                title={s.title}
                shortDescription={"shortDescription" in s ? s.shortDescription : null}
                images={parseImages("images" in s ? s.images : "[]")}
              />
            ))}
          </div>
          {serviceCards.length === 0 && (
            <p className="mt-6 text-center text-gray-500">Chưa có dịch vụ nào được đăng tải.</p>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Dự án tiêu biểu</h2>
          <p className="mt-2 text-gray-600">Công trình đã hoàn thiện tại Ninh Bình, Thanh Hoá, Hà Nam.</p>
          <div className="mt-8">
            <ProjectGallery projects={projectItems} showViewAll />
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Khu vực phục vụ</h2>
          <p className="mt-2 text-gray-600">Khảo sát, báo giá miễn phí tận nơi trong ngày.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {locationCards.map((loc) => (
              <LocationCard
                key={loc.slug}
                slug={loc.slug}
                title={loc.title}
                images={parseImages("images" in loc ? loc.images : "[]")}
                excerpt={LOCATION_EXCERPTS[loc.slug] || `Thi công tại ${loc.title}.`}
              />
            ))}
          </div>
          {locationCards.length === 0 && (
            <p className="mt-6 text-center text-gray-500">Chưa có khu vực nào được đăng tải.</p>
          )}
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Câu hỏi thường gặp</h2>
            <div className="mt-8">
              <FaqAccordion items={faqs} />
            </div>
            <div className="mt-6 text-center">
              <Link href="/faq" className="text-sm font-medium text-brand hover:underline">
                Xem tất cả câu hỏi →
              </Link>
            </div>
          </div>
        </section>
      )}

      <CtaSection />

      <section className="bg-white py-16">
        <div className="mx-auto max-w-lg px-4 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900">Liên hệ nhanh</h2>
          <p className="mt-2 text-center text-gray-600">Để lại thông tin, chúng tôi sẽ gọi lại ngay.</p>
          <div className="mt-8">
            <ContactForm phone={settings.phone} />
          </div>
        </div>
      </section>
    </>
  );
}
