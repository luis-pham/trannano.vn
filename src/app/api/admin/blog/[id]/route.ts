import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { blogSchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slugify";
import { jsonError, zodError, nullIfEmpty } from "@/lib/api";

function parsePublishedAt(value?: string | null, fallback?: Date): Date {
  if (value && value.trim() !== "") return new Date(value);
  return fallback ?? new Date();
}

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const item = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!item) return jsonError("Không tìm thấy", 404);
  return NextResponse.json(item);
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  try {
    const existing = await prisma.blogPost.findUnique({ where: { id: params.id } });
    if (!existing) return jsonError("Không tìm thấy", 404);

    const body = await request.json();
    const parsed = blogSchema.safeParse(body);
    if (!parsed.success) return zodError(parsed.error);
    const data = parsed.data;

    let slug = existing.slug;
    if (data.slug && data.slug !== existing.slug) {
      slug = await uniqueSlug(data.slug, async (s) => {
        const found = await prisma.blogPost.findFirst({
          where: { slug: s, NOT: { id: params.id } },
        });
        return Boolean(found);
      });
    }

    const item = await prisma.blogPost.update({
      where: { id: params.id },
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
        publishedAt: parsePublishedAt(data.publishedAt, existing.publishedAt),
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${existing.slug}`);
    revalidatePath(`/blog/${item.slug}`);
    return NextResponse.json(item);
  } catch (e) {
    console.error(e);
    return jsonError("Không cập nhật được", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const existing = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!existing) return jsonError("Không tìm thấy", 404);
  await prisma.blogPost.delete({ where: { id: params.id } });
  revalidatePath("/blog");
  revalidatePath(`/blog/${existing.slug}`);
  return NextResponse.json({ ok: true });
}
