import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { blogSchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slugify";
import { jsonError, zodError, nullIfEmpty } from "@/lib/api";

function parsePublishedAt(value?: string | null): Date {
  if (value && value.trim() !== "") return new Date(value);
  return new Date();
}

export async function GET() {
  const items = await prisma.blogPost.findMany({ orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }] });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = blogSchema.safeParse(body);
    if (!parsed.success) return zodError(parsed.error);
    const data = parsed.data;

    const slug = await uniqueSlug(data.slug || data.title, async (s) => {
      const found = await prisma.blogPost.findUnique({ where: { slug: s } });
      return Boolean(found);
    });

    const item = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug,
        excerpt: nullIfEmpty(data.excerpt) ?? null,
        content: data.content,
        coverImage: nullIfEmpty(data.coverImage) ?? null,
        category: nullIfEmpty(data.category) ?? null,
        metaTitle: nullIfEmpty(data.metaTitle) ?? null,
        metaDescription: nullIfEmpty(data.metaDescription) ?? null,
        ogImage: nullIfEmpty(data.ogImage) ?? null,
        published: data.published,
        publishedAt: parsePublishedAt(data.publishedAt),
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${item.slug}`);
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    console.error(e);
    return jsonError("Không tạo được bài viết", 500);
  }
}
