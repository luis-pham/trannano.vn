"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

type HeroCarouselProps = {
  images: string[];
  alt?: string;
};

export default function HeroCarousel({
  images,
  alt = "Công trình trần nhựa nano Nội Thất Tài Đức",
}: HeroCarouselProps) {
  const slides = images.length > 0 ? images : ["/images/hero-banner.png"];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (next: number) => {
      setIndex(((next % slides.length) + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const id = window.setInterval(() => go(index + 1), 5000);
    return () => window.clearInterval(id);
  }, [go, index, paused, slides.length]);

  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-gray-200 bg-surface-muted lg:aspect-auto lg:h-[480px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* absolute inset-0: tránh collapse height khi dùng Image fill + translateX */}
      <div
        className="absolute inset-0 flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((src, i) => (
          <div key={`${src}-${i}`} className="relative h-full w-full min-w-full shrink-0">
            <Image
              src={src}
              alt={i === index ? alt : ""}
              fill
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 640px"
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Ảnh trước"
            onClick={() => go(index - 1)}
            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/55"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Ảnh sau"
            onClick={() => go(index + 1)}
            className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/55"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Chuyển tới ảnh ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-accent" : "w-2 bg-white/60 hover:bg-white/90"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
