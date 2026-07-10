"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "./Lightbox";

type ImageGridProps = {
  images: { src: string; alt: string }[];
  columns?: 2 | 3 | 4;
};

export default function ImageGrid({ images, columns = 3 }: ImageGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const colClass =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 4
        ? "grid-cols-2 md:grid-cols-4"
        : "grid-cols-2 md:grid-cols-3";

  return (
    <>
      <div className={`grid ${colClass} gap-3`}>
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-muted"
            onClick={() => setLightboxIndex(i)}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
