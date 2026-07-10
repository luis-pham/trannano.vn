import Link from "next/link";
import { getSiteSettings, phoneTel } from "@/lib/seo";

type CtaSectionProps = {
  title?: string;
  subtitle?: string;
};

export default async function CtaSection({
  title = "Cần báo giá trần nhựa nano?",
  subtitle = "Khảo sát, báo giá miễn phí tận nơi tại Ninh Bình, Thanh Hoá, Hà Nam.",
}: CtaSectionProps) {
  const settings = await getSiteSettings();

  return (
    <section className="bg-surface-muted py-16">
      <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">{title}</h2>
        <p className="mt-3 text-gray-600">{subtitle}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={phoneTel(settings.phone)}
            className="rounded-full bg-accent px-6 py-3 font-semibold text-brand hover:bg-accent-light active:scale-[0.98]"
          >
            Gọi {settings.phone}
          </a>
          <Link
            href="/lien-he"
            className="rounded-full border border-brand px-6 py-3 font-semibold text-brand hover:bg-brand hover:text-white active:scale-[0.98]"
          >
            Nhận báo giá
          </Link>
        </div>
      </div>
    </section>
  );
}
