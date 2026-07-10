import Link from "next/link";
import Image from "next/image";
import { serviceImage } from "@/lib/placeholders";

type ServiceCardProps = {
  slug: string;
  title: string;
  shortDescription?: string | null;
  images: string[];
};

export default function ServiceCard({ slug, title, shortDescription, images }: ServiceCardProps) {
  const img = serviceImage(slug, images);

  return (
    <Link
      href={`/dich-vu/${slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
        <Image
          src={img}
          alt={`Dịch vụ ${title} - Trannano.vn`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand">{title}</h3>
        {shortDescription && (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{shortDescription}</p>
        )}
        <span className="mt-3 text-sm font-medium text-brand">Xem chi tiết →</span>
      </div>
    </Link>
  );
}
