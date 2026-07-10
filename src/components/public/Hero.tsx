import Image from "next/image";
import { phoneTel } from "@/lib/seo";
import { COMPANY_NAME } from "@/lib/brand";

type HeroProps = {
  phone: string;
};

export default function Hero({ phone }: HeroProps) {
  return (
    <section className="bg-brand text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:py-16">
        <div className="flex flex-col justify-center">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 shrink-0 bg-accent" aria-hidden />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {COMPANY_NAME}
            </p>
          </div>

          <h1 className="font-display text-2xl font-semibold leading-snug sm:text-3xl lg:text-[2.35rem] lg:leading-tight">
            Trần nhựa nano · Ốp tường nano · Lát sàn nhựa giả gỗ
          </h1>

          <p className="mt-4 text-lg font-medium text-white/90 sm:text-xl">
            Làm đẹp – làm kỹ – giá cả hợp lý
          </p>

          <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
            Thi công tại Ninh Bình, Thanh Hoá, Hà Nam — Báo giá miễn phí trong ngày
          </p>

          <a
            href={phoneTel(phone)}
            className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-accent px-6 py-3.5 text-base font-bold text-brand shadow-gold transition-colors hover:bg-accent-light active:scale-[0.98]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.25 1.01l-2.2 2.22z" />
            </svg>
            {phone}
          </a>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:min-h-[480px]">
          <Image
            src="/images/hero-banner.png"
            alt="Công trình trần nhựa nano Nội Thất Tài Đức"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 640px"
            className="object-cover object-right"
          />
        </div>
      </div>
    </section>
  );
}
