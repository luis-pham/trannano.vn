import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { parseImages } from "@/lib/images";
import { LOCATION_EXCERPTS } from "@/lib/local-seo";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import LocationCard from "@/components/public/LocationCard";
import CtaSection from "@/components/public/CtaSection";

export const revalidate = 3600;

export async function generateMetadata() {
  return buildMetadata({
    path: "/khu-vuc",
    fallbackTitle: "Khu vực thi công Ninh Bình, Thanh Hoá, Hà Nam",
    fallbackDescription:
      "Trannano.vn nhận thi công trần nhựa nano, ốp tường, sàn nhựa tại Ninh Bình, Thanh Hoá, Hà Nam. Báo giá miễn phí tận nơi.",
  });
}

export default async function KhuVucIndexPage() {
  const locations = await prisma.location.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <div className="bg-brand py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Breadcrumbs
            light
            items={[
              { name: "Trang chủ", href: "/" },
              { name: "Khu vực" },
            ]}
          />
          <h1 className="text-3xl font-bold md:text-4xl">Khu vực thi công</h1>
          <p className="mt-3 max-w-2xl text-white/90">
            Nội Thất Tài Đức phục vụ Ninh Bình, Thanh Hoá, Hà Nam — mỗi khu vực có trang riêng với
            công trình và thông tin địa phương.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {locations.map((loc) => (
            <LocationCard
              key={loc.slug}
              slug={loc.slug}
              title={loc.title}
              images={parseImages(loc.images)}
              excerpt={LOCATION_EXCERPTS[loc.slug] || `Thi công tại ${loc.title}.`}
            />
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-gray-600">
          Xem thêm{" "}
          <Link href="/dich-vu" className="font-medium text-brand hover:underline">
            dịch vụ
          </Link>{" "}
          hoặc{" "}
          <Link href="/du-an" className="font-medium text-brand hover:underline">
            dự án đã thi công
          </Link>
          .
        </p>
      </div>

      <CtaSection title="Cần khảo sát tại khu vực của bạn?" />
    </>
  );
}
