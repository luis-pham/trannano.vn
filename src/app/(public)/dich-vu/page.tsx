import { prisma } from "@/lib/prisma";
import { buildMetadata, getSiteSettings } from "@/lib/seo";
import { parseImages } from "@/lib/images";
import { buildServiceItemListJsonLd } from "@/lib/jsonld";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import ServiceCard from "@/components/public/ServiceCard";
import CtaSection from "@/components/public/CtaSection";
import JsonLd from "@/components/public/JsonLd";
import RelatedLinks from "@/components/public/RelatedLinks";

export async function generateMetadata() {
  return buildMetadata({
    path: "/dich-vu",
    fallbackTitle: "Dịch vụ thi công trần nhựa nano, sàn nhựa",
    fallbackDescription:
      "Danh sách dịch vụ: trần nhựa nano, ốp tường nhựa, lát sàn nhựa giả gỗ, vách bàn thờ, vách tủ tivi tại Ninh Bình, Thanh Hoá, Hà Nam.",
  });
}

export default async function DichVuPage() {
  const [services, settings, locations] = await Promise.all([
    prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    }),
    getSiteSettings(),
    prisma.location.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { slug: true, title: true },
    }),
  ]);

  return (
    <>
      <JsonLd
        data={buildServiceItemListJsonLd(services, settings.businessName, settings.serviceAreas)}
      />

      <div className="bg-brand py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Breadcrumbs
            light
            items={[
              { name: "Trang chủ", href: "/" },
              { name: "Dịch vụ" },
            ]}
          />
          <h1 className="text-3xl font-bold md:text-4xl">Dịch vụ thi công</h1>
          <p className="mt-3 max-w-2xl text-white/90">
            Trần nhựa nano, ốp tường, sàn nhựa giả gỗ và vách trang trí cho nhà ở, quán cafe, văn phòng.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard
              key={s.slug}
              slug={s.slug}
              title={s.title}
              shortDescription={s.shortDescription}
              images={parseImages(s.images)}
            />
          ))}
        </div>

        <RelatedLinks
          className="mt-12"
          title="Thi công theo khu vực"
          items={locations.map((loc) => ({
            slug: loc.slug,
            title: loc.title,
            href: `/khu-vuc/${loc.slug}`,
          }))}
        />
      </div>

      <CtaSection />
    </>
  );
}
