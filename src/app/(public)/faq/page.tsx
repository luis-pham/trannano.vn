import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { buildFaqPageJsonLd } from "@/lib/jsonld";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import FaqAccordion from "@/components/public/FaqAccordion";
import CtaSection from "@/components/public/CtaSection";
import JsonLd from "@/components/public/JsonLd";

export async function generateMetadata() {
  return buildMetadata({
    path: "/faq",
    fallbackTitle: "Câu hỏi thường gặp về trần nhựa nano",
    fallbackDescription:
      "Giải đáp thắc mắc về trần nhựa nano, sàn nhựa giả gỗ: độ bền, thời gian thi công, bảo hành, giá cả.",
  });
}

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  const faqSchema = buildFaqPageJsonLd(faqs);

  return (
    <>
      {faqSchema && <JsonLd data={faqSchema} />}

      <div className="bg-brand py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Breadcrumbs
            light
            items={[
              { name: "Trang chủ", href: "/" },
              { name: "FAQ" },
            ]}
          />
          <h1 className="text-3xl font-bold md:text-4xl">Câu hỏi thường gặp</h1>
          <p className="mt-3 max-w-2xl text-white/90">
            Giải đáp thắc mắc về trần nhựa nano, sàn nhựa giả gỗ và quy trình thi công.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        {faqs.length > 0 ? (
          <FaqAccordion items={faqs} />
        ) : (
          <p className="text-center text-gray-500">Chưa có câu hỏi nào.</p>
        )}

        <p className="mt-8 text-center text-gray-600">
          Không tìm thấy câu trả lời?{" "}
          <Link href="/lien-he" className="font-medium text-brand hover:underline">
            Liên hệ với chúng tôi
          </Link>
        </p>
      </div>

      <CtaSection />
    </>
  );
}
