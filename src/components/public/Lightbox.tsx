"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

type LightboxProps = {
  images: { src: string; alt: string }[];
  initialIndex?: number;
  onClose: () => void;
};

export default function Lightbox({ images, initialIndex = 0, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  const prev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setIndex((i) => (i < images.length - 1 ? i + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, prev, next]);

  const current = images[index];
  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      role="dialog"
      aria-modal
      aria-label="Xem ảnh"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        onClick={onClose}
        aria-label="Đóng"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Ảnh trước"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Ảnh sau"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </>
      )}

      <div className="relative max-h-[85vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <Image
          src={current.src}
          alt={current.alt}
          width={1200}
          height={900}
          className="max-h-[85vh] w-auto rounded-lg object-contain"
          priority
        />
        {images.length > 1 && (
          <p className="mt-2 text-center text-sm text-white/70">
            {index + 1} / {images.length}
          </p>
        )}
      </div>
    </div>
  );
}
