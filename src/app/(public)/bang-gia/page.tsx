import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata, formatPrice } from "@/lib/seo";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import CtaSection from "@/components/public/CtaSection";
import { safeQuery } from "@/lib/safe-query";

export async function generateMetadata() {
  return buildMetadata({
    path: "/bang-gia",
    fallbackTitle: "Bảng giá trần nhựa nano, sàn nhựa",
    fallbackDescription:
      "Giá thi công trần nhựa nano, sàn nhựa giả gỗ tham khảo tại Ninh Bình, Thanh Hoá, Hà Nam. Báo giá chính xác sau khảo sát tận nơi.",
  });
}

export default async function BangGiaPage() {
  const services = await safeQuery(
    "bang-gia.services",
    () =>
      prisma.service.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        include: {
          priceItems: { orderBy: { order: "asc" } },
        },
      }),
    []
  );

  const orphanPrices = await safeQuery(
    "bang-gia.orphan",
    () =>
      prisma.priceItem.findMany({
        where: { serviceId: null },
        orderBy: { order: "asc" },
      }),
    []
  );

  return (
    <>
      <div className="bg-brand py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Breadcrumbs
            light
            items={[
              { name: "Trang chủ", href: "/" },
              { name: "Bảng giá" },
            ]}
          />
          <h1 className="text-3xl font-bold md:text-4xl">Bảng giá tham khảo</h1>
          <p className="mt-3 max-w-2xl text-white/90">
            Giá có thể thay đổi tuỳ diện tích, mẫu vật liệu và độ phức tạp công trình. Liên hệ để được báo giá chính xác.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="space-y-10">
          {services.map((service) =>
            service.priceItems.length > 0 ? (
              <div key={service.id}>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-900">{service.title}</h2>
                  <Link
                    href={`/dich-vu/${service.slug}`}
                    className="shrink-0 text-sm font-medium text-brand hover:underline"
                  >
                    Chi tiết dịch vụ →
                  </Link>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-muted">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-900">Hạng mục</th>
                        <th className="px-4 py-3 font-semibold text-gray-900">Giá từ</th>
                        <th className="hidden px-4 py-3 font-semibold text-gray-900 sm:table-cell">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {service.priceItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-gray-900">{item.name}</td>
                          <td className="px-4 py-3 font-medium text-brand">
                            {formatPrice(item.priceFrom)}/{item.unit}
                          </td>
                          <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">
                            {item.note || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null
          )}

          {orphanPrices.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-900">Hạng mục khác</h2>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {orphanPrices.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-gray-900">{item.name}</td>
                        <td className="px-4 py-3 font-medium text-brand">
                          {formatPrice(item.priceFrom)}/{item.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {services.every((s) => s.priceItems.length === 0) && orphanPrices.length === 0 && (
            <p className="text-center text-gray-500">
              Bảng giá đang được cập nhật. Vui lòng gọi hotline để được báo giá.
            </p>
          )}
        </div>

        <p className="mt-8 text-sm text-gray-500">
          * Giá trên đã bao gồm nhân công thi công (tuỳ hạng mục). Không phát sinh chi phí ngoài báo giá ban đầu.
        </p>
      </div>

      <CtaSection title="Nhận báo giá chính xác cho công trình của bạn" />
    </>
  );
}
