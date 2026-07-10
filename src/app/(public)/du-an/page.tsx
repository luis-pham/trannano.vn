import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { parseImages } from "@/lib/images";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import ProjectGallery from "@/components/public/ProjectGallery";
import CtaSection from "@/components/public/CtaSection";

export async function generateMetadata() {
  return buildMetadata({
    path: "/du-an",
    fallbackTitle: "Dự án thi công trần nhựa nano",
    fallbackDescription:
      "Album công trình trần nhựa nano, sàn nhựa giả gỗ đã hoàn thiện tại Ninh Bình, Thanh Hoá, Hà Nam.",
  });
}

type SearchParams = { location?: string };

export default async function DuAnPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const locations = await prisma.location.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    select: { id: true, slug: true, title: true },
  });

  const locationFilter = searchParams.location
    ? locations.find((l) => l.slug === searchParams.location)
    : null;

  const projects = await prisma.project.findMany({
    where: {
      published: true,
      ...(locationFilter ? { locationId: locationFilter.id } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { location: { select: { title: true } } },
  });

  const projectItems = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    images: parseImages(p.images),
    locationTitle: p.location?.title,
  }));

  return (
    <>
      <div className="bg-brand py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Breadcrumbs
            light
            items={[
              { name: "Trang chủ", href: "/" },
              { name: "Dự án" },
            ]}
          />
          <h1 className="text-3xl font-bold md:text-4xl">Dự án thi công</h1>
          <p className="mt-3 max-w-2xl text-white/90">
            Công trình trần nhựa nano, sàn nhựa giả gỗ đã hoàn thiện.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/du-an"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !locationFilter
                ? "bg-brand text-white"
                : "bg-surface-muted text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tất cả
          </Link>
          {locations.map((loc) => (
            <Link
              key={loc.slug}
              href={`/du-an?location=${loc.slug}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                locationFilter?.slug === loc.slug
                  ? "bg-brand text-white"
                  : "bg-surface-muted text-gray-700 hover:bg-gray-200"
              }`}
            >
              {loc.title}
            </Link>
          ))}
        </div>

        {locationFilter && (
          <p className="mb-6 text-gray-600">
            Đang lọc: <strong>{locationFilter.title}</strong> ({projects.length} dự án).{" "}
            <Link
              href={`/khu-vuc/${locationFilter.slug}`}
              className="font-medium text-brand hover:underline"
            >
              Xem trang khu vực {locationFilter.title} →
            </Link>
          </p>
        )}

        <ProjectGallery projects={projectItems} />
      </div>

      <CtaSection />
    </>
  );
}
