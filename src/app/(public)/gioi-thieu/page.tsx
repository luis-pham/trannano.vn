import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { safeQuery } from "@/lib/safe-query";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import ProseContent from "@/components/public/ProseContent";
import CtaSection from "@/components/public/CtaSection";

const FALLBACK_PAGE = {
  title: "Giới thiệu Nội Thất Tài Đức",
  content:
    "<p>Nội Thất Tài Đức (Trannano.vn) chuyên thi công trần nhựa nano, lát sàn nhựa giả gỗ cho nhà ở, chung cư, quán cà phê, văn phòng tại Ninh Bình, Thanh Hoá, Hà Nam.</p><ul><li>Khảo sát, báo giá miễn phí tận nơi</li><li>Vật tư chính hãng, có xuất xứ rõ ràng</li><li>Thi công nhanh, gọn, sạch</li><li>Bảo hành từ 3-5 năm tuỳ hạng mục</li><li>Giá thợ trực tiếp, không qua trung gian</li></ul>",
  metaTitle: null as string | null,
  metaDescription: null as string | null,
  ogImage: null as string | null,
};

export async function generateMetadata() {
  const page = await safeQuery(
    "gioi-thieu.meta",
    () => prisma.page.findUnique({ where: { slug: "gioi-thieu" } }),
    null
  );
  return buildMetadata({
    title: page?.metaTitle,
    description: page?.metaDescription,
    ogImage: page?.ogImage,
    path: "/gioi-thieu",
    fallbackTitle: page?.title || FALLBACK_PAGE.title,
  });
}

export default async function GioiThieuPage() {
  const page =
    (await safeQuery(
      "gioi-thieu.page",
      () => prisma.page.findUnique({ where: { slug: "gioi-thieu" } }),
      null
    )) || FALLBACK_PAGE;

  return (
    <>
      <div className="bg-brand py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Breadcrumbs
            light
            items={[
              { name: "Trang chủ", href: "/" },
              { name: "Giới thiệu" },
            ]}
          />
          <h1 className="text-3xl font-bold md:text-4xl">{page.title}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <ProseContent html={page.content} />
      </div>

      <CtaSection />
    </>
  );
}
