import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { buildMetadata, getSiteSettings } from "@/lib/seo";
import { parseImages } from "@/lib/images";
import { locationImage } from "@/lib/placeholders";
import { buildLocationServiceJsonLd } from "@/lib/jsonld";
import { relatedBlogSlugsForLocation } from "@/lib/local-seo";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import ProseContent from "@/components/public/ProseContent";
import ProjectGallery from "@/components/public/ProjectGallery";
import ServiceCard from "@/components/public/ServiceCard";
import CtaSection from "@/components/public/CtaSection";
import JsonLd from "@/components/public/JsonLd";
import RelatedLinks from "@/components/public/RelatedLinks";

export const revalidate = 3600;

export async function generateStaticParams() {
  const locations = await prisma.location.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const location = await prisma.location.findFirst({
    where: { slug: params.slug, published: true },
  });
  if (!location) return {};
  const images = parseImages(location.images);
  return buildMetadata({
    title: location.metaTitle,
    description: location.metaDescription,
    ogImage: location.ogImage || images[0],
    path: `/khu-vuc/${location.slug}`,
    fallbackTitle: `Thi công trần nhựa nano tại ${location.title}`,
    fallbackDescription: `Dịch vụ trần nhựa nano, sàn nhựa giả gỗ tại ${location.title}. Khảo sát, báo giá miễn phí tận nơi.`,
  });
}

export default async function LocationDetailPage({ params }: { params: { slug: string } }) {
  const location = await prisma.location.findFirst({
    where: { slug: params.slug, published: true },
    include: {
      projects: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!location) notFound();

  const relatedBlogSlugs = relatedBlogSlugsForLocation(location.slug);

  const [services, settings, otherLocations, relatedPosts] = await Promise.all([
    prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    }),
    getSiteSettings(),
    prisma.location.findMany({
      where: { published: true, NOT: { id: location.id } },
      orderBy: { order: "asc" },
      select: { slug: true, title: true },
    }),
    relatedBlogSlugs.length > 0
      ? prisma.blogPost.findMany({
          where: { published: true, slug: { in: relatedBlogSlugs } },
          select: { slug: true, title: true },
          take: 4,
        })
      : Promise.resolve([]),
  ]);

  const images = parseImages(location.images);
  const heroImg = locationImage(location.slug, images);

  const projectItems = location.projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    images: parseImages(p.images),
    locationTitle: location.title,
  }));

  return (
    <>
      <JsonLd
        data={buildLocationServiceJsonLd(
          { title: location.title, slug: location.slug },
          settings.businessName,
          settings.serviceAreas
        )}
      />
      <div className="bg-brand py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Breadcrumbs
            light
            items={[
              { name: "Trang chủ", href: "/" },
              { name: "Khu vực", href: "/khu-vuc" },
              { name: location.title },
            ]}
          />
          <h1 className="text-3xl font-bold md:text-4xl">
            Thi công trần nhựa nano tại {location.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="relative mb-10 aspect-[21/9] overflow-hidden rounded-xl bg-surface-muted">
          <Image
            src={heroImg}
            alt={`Công trình trần nhựa nano tại ${location.title}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="max-w-3xl">
          <ProseContent html={location.content} />
        </div>

        <div className="mt-12">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Dự án tại {location.title}</h2>
            <Link
              href={`/du-an?location=${location.slug}`}
              className="text-sm font-medium text-brand hover:underline"
            >
              Xem tất cả dự án tại {location.title} →
            </Link>
          </div>
          {projectItems.length > 0 ? (
            <ProjectGallery projects={projectItems} />
          ) : (
            <p className="text-gray-600">
              Đang cập nhật album công trình tại {location.title}.{" "}
              <Link href="/lien-he" className="font-medium text-brand hover:underline">
                Liên hệ khảo sát
              </Link>
            </p>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">Dịch vụ tại {location.title}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard
                key={s.slug}
                slug={s.slug}
                title={s.title}
                shortDescription={
                  s.shortDescription
                    ? `${s.shortDescription} Thi công tại ${location.title}.`
                    : `Thi công ${s.title} tại ${location.title}.`
                }
                images={parseImages(s.images)}
              />
            ))}
          </div>
          <div className="mt-4">
            <Link href="/dich-vu" className="text-sm font-medium text-brand hover:underline">
              Xem tất cả dịch vụ →
            </Link>
          </div>
        </div>

        <RelatedLinks
          className="mt-12"
          title="Bài viết liên quan"
          items={relatedPosts.map((p) => ({
            slug: p.slug,
            title: p.title,
            href: `/blog/${p.slug}`,
          }))}
        />

        <RelatedLinks
          className="mt-12"
          title="Khu vực lân cận"
          items={otherLocations.map((loc) => ({
            slug: loc.slug,
            title: `Thi công tại ${loc.title}`,
            href: `/khu-vuc/${loc.slug}`,
          }))}
        />
      </div>

      <CtaSection
        title={`Đặt lịch khảo sát tại ${location.title}`}
        subtitle={`Gọi ${settings.phone} để được tư vấn và báo giá miễn phí tận nơi tại ${location.title}.`}
      />
    </>
  );
}
