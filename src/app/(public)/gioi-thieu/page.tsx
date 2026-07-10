import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { safeQuery } from "@/lib/safe-query";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import ProseContent from "@/components/public/ProseContent";
import CtaSection from "@/components/public/CtaSection";

export async function generateMetadata() {
  const page = await safeQuery(
    "gioi-thieu.meta",
    () => prisma.page.findUnique({ where: { slug: "gioi-thieu" } }),
    null
  );
  if (!page) return {};
  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    ogImage: page.ogImage,
    path: "/gioi-thieu",
    fallbackTitle: page.title,
  });
}

export default async function GioiThieuPage() {
  const page = await safeQuery(
    "gioi-thieu.page",
    () => prisma.page.findUnique({ where: { slug: "gioi-thieu" } }),
    null
  );
  if (!page) notFound();

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
