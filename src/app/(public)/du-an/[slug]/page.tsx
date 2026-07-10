import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { parseImages } from "@/lib/images";
import { projectImage } from "@/lib/placeholders";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import ProseContent from "@/components/public/ProseContent";
import ImageGrid from "@/components/public/ImageGrid";
import CtaSection from "@/components/public/CtaSection";
import RelatedLinks from "@/components/public/RelatedLinks";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await prisma.project.findFirst({
    where: { slug: params.slug, published: true },
  });
  if (!project) return {};
  const images = parseImages(project.images);
  return buildMetadata({
    title: project.metaTitle,
    description: project.metaDescription,
    ogImage: project.ogImage || images[0],
    path: `/du-an/${project.slug}`,
    fallbackTitle: project.title,
  });
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const [project, services] = await Promise.all([
    prisma.project.findFirst({
      where: { slug: params.slug, published: true },
      include: { location: { select: { title: true, slug: true } } },
    }),
    prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 3,
      select: { slug: true, title: true },
    }),
  ]);

  if (!project) notFound();

  const images = parseImages(project.images);
  const heroImg = projectImage(project.slug, images);
  const galleryImages =
    images.length > 0
      ? images.map((src, i) => ({ src, alt: `${project.title} - ảnh ${i + 1}` }))
      : [{ src: heroImg, alt: project.title }];

  return (
    <>
      <div className="bg-brand py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Breadcrumbs
            light
            items={[
              { name: "Trang chủ", href: "/" },
              { name: "Dự án", href: "/du-an" },
              { name: project.title },
            ]}
          />
          <h1 className="text-3xl font-bold md:text-4xl">{project.title}</h1>
          {project.location && (
            <p className="mt-2 text-white/80">
              Khu vực:{" "}
              <Link
                href={`/khu-vuc/${project.location.slug}`}
                className="font-medium text-accent underline-offset-2 hover:underline"
              >
                {project.location.title}
              </Link>
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-xl bg-surface-muted">
          <Image
            src={heroImg}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="max-w-3xl">
          <ProseContent html={project.content} />
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">Hình ảnh công trình</h2>
          <div className="mt-6">
            <ImageGrid images={galleryImages} />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-10">
          {project.location && (
            <RelatedLinks
              title="Xem thêm theo khu vực"
              items={[
                {
                  slug: project.location.slug,
                  title: `Trang khu vực ${project.location.title}`,
                  href: `/khu-vuc/${project.location.slug}`,
                },
                {
                  slug: `du-an-${project.location.slug}`,
                  title: `Tất cả dự án tại ${project.location.title}`,
                  href: `/du-an?location=${project.location.slug}`,
                },
              ]}
            />
          )}
          <RelatedLinks
            title="Dịch vụ liên quan"
            items={services.map((s) => ({
              slug: s.slug,
              title: s.title,
              href: `/dich-vu/${s.slug}`,
            }))}
          />
        </div>
      </div>

      <CtaSection title="Muốn thi công tương tự?" />
    </>
  );
}
