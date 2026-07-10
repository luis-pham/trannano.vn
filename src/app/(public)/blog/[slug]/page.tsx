import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { buildMetadata, getSiteSettings } from "@/lib/seo";
import { placeholderImage } from "@/lib/placeholders";
import { buildBlogPostingJsonLd } from "@/lib/jsonld";
import { relatedForBlog } from "@/lib/local-seo";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import ProseContent from "@/components/public/ProseContent";
import CtaSection from "@/components/public/CtaSection";
import JsonLd from "@/components/public/JsonLd";
import RelatedLinks from "@/components/public/RelatedLinks";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findFirst({
    where: { slug: params.slug, published: true },
  });
  if (!post) return {};
  return buildMetadata({
    title: post.metaTitle,
    description: post.metaDescription || post.excerpt,
    ogImage: post.ogImage || post.coverImage,
    path: `/blog/${post.slug}`,
    fallbackTitle: post.title,
    fallbackDescription: post.excerpt,
  });
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const related = relatedForBlog(params.slug);

  const [post, settings, services, locations] = await Promise.all([
    prisma.blogPost.findFirst({
      where: { slug: params.slug, published: true },
    }),
    getSiteSettings(),
    prisma.service.findMany({
      where: { published: true, slug: { in: related.services } },
      select: { slug: true, title: true },
    }),
    prisma.location.findMany({
      where: { published: true, slug: { in: related.locations } },
      select: { slug: true, title: true },
      orderBy: { order: "asc" },
    }),
  ]);

  if (!post) notFound();

  const cover =
    post.coverImage || placeholderImage(`trannano-blog-${post.slug}`, 1200, 600);

  return (
    <>
      <JsonLd data={buildBlogPostingJsonLd(post, settings.businessName)} />
      <div className="bg-brand py-12 text-white">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Breadcrumbs
            light
            items={[
              { name: "Trang chủ", href: "/" },
              { name: "Blog", href: "/blog" },
              { name: post.title },
            ]}
          />
          {post.category && (
            <span className="text-sm font-medium uppercase tracking-wide text-white/70">
              {post.category}
            </span>
          )}
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">{post.title}</h1>
          <time dateTime={post.publishedAt.toISOString()} className="mt-3 block text-white/70">
            {post.publishedAt.toLocaleDateString("vi-VN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <div className="relative mb-10 aspect-[2/1] overflow-hidden rounded-xl bg-surface-muted">
          <Image
            src={cover}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {post.excerpt && (
          <p className="mb-8 text-lg font-medium text-gray-700">{post.excerpt}</p>
        )}

        <ProseContent html={post.content} />

        <div className="mt-12 space-y-10 border-t border-gray-200 pt-8">
          <RelatedLinks
            title="Dịch vụ liên quan"
            items={services.map((s) => ({
              slug: s.slug,
              title: s.title,
              href: `/dich-vu/${s.slug}`,
            }))}
          />
          <RelatedLinks
            title="Thi công theo khu vực"
            items={locations.map((loc) => ({
              slug: loc.slug,
              title: `Tại ${loc.title}`,
              href: `/khu-vuc/${loc.slug}`,
            }))}
          />
          <Link href="/blog" className="inline-block text-sm font-medium text-brand hover:underline">
            ← Quay lại danh sách bài viết
          </Link>
        </div>
      </article>

      <CtaSection />
    </>
  );
}
