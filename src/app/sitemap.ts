import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/gioi-thieu`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/lien-he`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/dich-vu`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/khu-vuc`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/du-an`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/bang-gia`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/faq`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.7 },
  ];

  try {
    const [services, locations, projects, posts] = await Promise.all([
      prisma.service.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.location.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.project.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    return [
      ...staticPages,
      ...services.map((s) => ({
        url: `${base}/dich-vu/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      })),
      ...locations.map((l) => ({
        url: `${base}/khu-vuc/${l.slug}`,
        lastModified: l.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      })),
      ...projects.map((p) => ({
        url: `${base}/du-an/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...posts.map((p) => ({
        url: `${base}/blog/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.65,
      })),
    ];
  } catch (e) {
    console.error("sitemap: database unavailable, returning static URLs only", e);
    return staticPages;
  }
}
