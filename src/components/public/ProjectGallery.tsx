import Link from "next/link";
import Image from "next/image";
import { projectImage } from "@/lib/placeholders";

type ProjectItem = {
  slug: string;
  title: string;
  images: string[];
  locationTitle?: string | null;
};

type ProjectGalleryProps = {
  projects: ProjectItem[];
  limit?: number;
  showViewAll?: boolean;
};

export default function ProjectGallery({
  projects,
  limit,
  showViewAll = false,
}: ProjectGalleryProps) {
  const items = limit ? projects.slice(0, limit) : projects;

  if (items.length === 0) {
    return (
      <p className="text-center text-gray-500">Chưa có dự án nào được đăng tải.</p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((project) => {
          const img = projectImage(project.slug, project.images);
          return (
            <Link
              key={project.slug}
              href={`/du-an/${project.slug}`}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
                <Image
                  src={img}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 group-hover:text-brand">
                  {project.title}
                </h3>
                {project.locationTitle && (
                  <p className="mt-1 text-sm text-gray-500">{project.locationTitle}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
      {showViewAll && (
        <div className="mt-8 text-center">
          <Link
            href="/du-an"
            className="inline-flex items-center rounded-lg border border-brand px-6 py-3 font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
          >
            Xem thêm dự án
          </Link>
        </div>
      )}
    </div>
  );
}
