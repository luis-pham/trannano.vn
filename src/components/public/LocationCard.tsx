import Link from "next/link";
import Image from "next/image";
import { locationImage } from "@/lib/placeholders";

type LocationCardProps = {
  slug: string;
  title: string;
  images: string[];
  excerpt?: string;
};

export default function LocationCard({ slug, title, images, excerpt }: LocationCardProps) {
  const img = locationImage(slug, images);

  return (
    <Link
      href={`/khu-vuc/${slug}`}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-surface-muted">
        <Image
          src={img}
          alt={`Thi công trần nhựa nano tại ${title}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand">{title}</h3>
        {excerpt && <p className="mt-2 text-sm text-gray-600 line-clamp-2">{excerpt}</p>}
        <span className="mt-3 inline-block text-sm font-medium text-brand">Xem chi tiết →</span>
      </div>
    </Link>
  );
}
