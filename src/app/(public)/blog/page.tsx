import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { placeholderImage } from "@/lib/placeholders";
import { safeQuery } from "@/lib/safe-query";
import Breadcrumbs from "@/components/public/Breadcrumbs";

export async function generateMetadata() {
  return buildMetadata({
    path: "/blog",
    fallbackTitle: "Tin tức trần nhựa nano, sàn nhựa",
    fallbackDescription:
      "Tin tức và bài viết tư vấn về trần nhựa nano, sàn nhựa giả gỗ, bảo quản và chọn mẫu phù hợp.",
  });
}

export default async function BlogPage() {
  const posts = await safeQuery(
    "blog.list",
    () =>
      prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
      }),
    []
  );

  return (
    <>
      <div className="bg-brand py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Breadcrumbs
            light
            items={[
              { name: "Trang chủ", href: "/" },
              { name: "Tin tức" },
            ]}
          />
          <h1 className="text-3xl font-bold md:text-4xl">Tin tức</h1>
          <p className="mt-3 max-w-2xl text-white/90">
            Kiến thức, kinh nghiệm về trần nhựa nano và sàn nhựa giả gỗ.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">
            Chưa có bài viết nào. Nếu bạn là admin, kiểm tra kết nối database và chạy seed.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const cover =
                post.coverImage || placeholderImage(`trannano-blog-${post.slug}`, 600, 400);
              return (
                <article
                  key={post.slug}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative aspect-[3/2] overflow-hidden bg-surface-muted">
                      <Image
                        src={cover}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      {post.category && (
                        <span className="text-xs font-medium uppercase tracking-wide text-brand">
                          {post.category}
                        </span>
                      )}
                      <h2 className="mt-1 text-lg font-semibold text-gray-900 group-hover:text-brand">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">{post.excerpt}</p>
                      )}
                      <time
                        dateTime={post.publishedAt.toISOString()}
                        className="mt-3 block text-xs text-gray-400"
                      >
                        {post.publishedAt.toLocaleDateString("vi-VN")}
                      </time>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
