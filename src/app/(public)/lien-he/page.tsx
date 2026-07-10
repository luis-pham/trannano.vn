import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata, getSiteSettings, toMapEmbedUrl } from "@/lib/seo";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import ProseContent from "@/components/public/ProseContent";
import ContactForm from "@/components/public/ContactForm";

export async function generateMetadata() {
  const page = await prisma.page.findUnique({ where: { slug: "lien-he" } });
  if (!page) return {};
  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    ogImage: page.ogImage,
    path: "/lien-he",
    fallbackTitle: page.title,
  });
}

export default async function LienHePage() {
  const [page, settings] = await Promise.all([
    prisma.page.findUnique({ where: { slug: "lien-he" } }),
    getSiteSettings(),
  ]);
  if (!page) notFound();

  const mapSrc = toMapEmbedUrl(settings.mapEmbedUrl);

  return (
    <>
      <div className="bg-brand py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Breadcrumbs
            light
            items={[
              { name: "Trang chủ", href: "/" },
              { name: "Liên hệ" },
            ]}
          />
          <h1 className="text-3xl font-bold md:text-4xl">{page.title}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <ProseContent html={page.content} />
            <dl className="mt-8 space-y-4 rounded-xl border border-gray-200 bg-white p-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Hotline</dt>
                <dd className="mt-1 text-lg font-semibold text-brand">
                  <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}>{settings.phone}</a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Liên hệ</dt>
                <dd className="mt-1 text-gray-900">{settings.workingHours}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Khu vực phục vụ</dt>
                <dd className="mt-1 text-gray-900">{settings.serviceAreas}</dd>
              </div>
              {settings.address && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Địa chỉ</dt>
                  <dd className="mt-1 text-gray-900">{settings.address}</dd>
                </div>
              )}
            </dl>
          </div>

          <div>
            <h2 className="mb-6 text-xl font-bold text-gray-900">Gửi yêu cầu báo giá</h2>
            <ContactForm phone={settings.phone} />
          </div>
        </div>

        {mapSrc && (
          <div className="mt-12">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Bản đồ</h2>
            <div className="aspect-video overflow-hidden rounded-xl border border-gray-200">
              <iframe
                src={mapSrc}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title="Bản đồ Nội Thất Tài Đức"
              />
            </div>
            {settings.googleBusinessUrl && (
              <p className="mt-3 text-sm">
                <a
                  href={settings.googleBusinessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand hover:underline"
                >
                  Mở trên Google Maps →
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
