import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { buildMetadata, getSiteSettings, formatPrice } from "@/lib/seo";
import { parseImages } from "@/lib/images";
import { buildServiceJsonLd, buildFaqPageJsonLd } from "@/lib/jsonld";
import { serviceImage } from "@/lib/placeholders";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import ProseContent from "@/components/public/ProseContent";
import ImageGrid from "@/components/public/ImageGrid";
import FaqAccordion from "@/components/public/FaqAccordion";
import CtaSection from "@/components/public/CtaSection";
import JsonLd from "@/components/public/JsonLd";
import RelatedLinks from "@/components/public/RelatedLinks";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = await prisma.service.findFirst({
    where: { slug: params.slug, published: true },
  });
  if (!service) return {};
  const images = parseImages(service.images);
  return buildMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    ogImage: service.ogImage || images[0],
    path: `/dich-vu/${service.slug}`,
    fallbackTitle: service.title,
    fallbackDescription: service.shortDescription,
  });
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const [service, settings, fallbackFaqs, locations] = await Promise.all([
    prisma.service.findFirst({
      where: { slug: params.slug, published: true },
      include: {
        priceItems: { orderBy: { order: "asc" } },
        faqs: { where: { published: true }, orderBy: { order: "asc" } },
      },
    }),
    getSiteSettings(),
    prisma.faq.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 5,
    }),
    prisma.location.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { slug: true, title: true },
    }),
  ]);

  if (!service) notFound();

  const images = parseImages(service.images);
  const heroImg = serviceImage(service.slug, images);
  const galleryImages = images.length > 0
    ? images.map((src, i) => ({ src, alt: `${service.title} - ảnh ${i + 1}` }))
    : [{ src: heroImg, alt: `Thi công ${service.title} - Trannano.vn` }];

  const faqItems = service.faqs.length > 0 ? service.faqs : fallbackFaqs;
  const faqSchema = buildFaqPageJsonLd(faqItems);

  const jsonLdData = [
    buildServiceJsonLd(
      {
        title: service.title,
        slug: service.slug,
        shortDescription: service.shortDescription,
      },
      settings.businessName,
      settings.serviceAreas
    ),
    ...(faqSchema ? [faqSchema] : []),
  ];

  return (
    <>
      <JsonLd data={jsonLdData} />

      <div className="bg-brand py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Breadcrumbs
            light
            items={[
              { name: "Trang chủ", href: "/" },
              { name: "Dịch vụ", href: "/dich-vu" },
              { name: service.title },
            ]}
          />
          <h1 className="text-3xl font-bold md:text-4xl">{service.title}</h1>
          {service.shortDescription && (
            <p className="mt-3 max-w-2xl text-white/90">{service.shortDescription}</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="relative mb-10 aspect-[21/9] overflow-hidden rounded-xl bg-surface-muted">
          <Image
            src={heroImg}
            alt={`Thi công ${service.title} tại Ninh Bình, Thanh Hoá`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="max-w-3xl">
          <ProseContent html={service.content} />
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">Hình ảnh công trình</h2>
          <div className="mt-6">
            <ImageGrid images={galleryImages} />
          </div>
        </div>

        {service.priceItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Bảng giá tham khảo</h2>
            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-900">Hạng mục</th>
                    <th className="px-4 py-3 font-semibold text-gray-900">Giá từ</th>
                    <th className="hidden px-4 py-3 font-semibold text-gray-900 sm:table-cell">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {service.priceItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 font-medium text-brand">
                        {formatPrice(item.priceFrom)}/{item.unit}
                      </td>
                      <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">{item.note || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Giá tham khảo, có thể thay đổi tuỳ diện tích và mẫu vật liệu.{" "}
              <Link href="/bang-gia" className="text-brand hover:underline">
                Xem bảng giá đầy đủ
              </Link>
            </p>
          </div>
        )}

        {faqItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Câu hỏi về {service.title}</h2>
            <div className="mt-6 max-w-3xl">
              <FaqAccordion items={faqItems} />
            </div>
          </div>
        )}

        <RelatedLinks
          className="mt-12"
          title={`Thi công ${service.title} tại`}
          items={locations.map((loc) => ({
            slug: loc.slug,
            title: `${service.title} tại ${loc.title}`,
            href: `/khu-vuc/${loc.slug}`,
          }))}
        />
      </div>

      <CtaSection title={`Cần báo giá ${service.title}?`} />
    </>
  );
}
