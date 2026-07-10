import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { locationSchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slugify";
import { parseImages, stringifyImages } from "@/lib/images";
import { jsonError, zodError, nullIfEmpty } from "@/lib/api";

function serialize(location: { images: string; [key: string]: unknown }) {
  return { ...location, images: parseImages(location.images) };
}

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const item = await prisma.location.findUnique({ where: { id: params.id } });
  if (!item) return jsonError("Không tìm thấy", 404);
  return NextResponse.json(serialize(item));
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  try {
    const existing = await prisma.location.findUnique({ where: { id: params.id } });
    if (!existing) return jsonError("Không tìm thấy", 404);

    const body = await request.json();
    const parsed = locationSchema.safeParse(body);
    if (!parsed.success) return zodError(parsed.error);
    const data = parsed.data;

    let slug = existing.slug;
    if (data.slug && data.slug !== existing.slug) {
      slug = await uniqueSlug(data.slug, async (s) => {
        const found = await prisma.location.findFirst({
          where: { slug: s, NOT: { id: params.id } },
        });
        return Boolean(found);
      });
    }

    const item = await prisma.location.update({
      where: { id: params.id },
      data: {
        title: data.title,
        slug,
        content: data.content,
        images: stringifyImages(data.images),
        metaTitle: nullIfEmpty(data.metaTitle) ?? null,
        metaDescription: nullIfEmpty(data.metaDescription) ?? null,
        ogImage: nullIfEmpty(data.ogImage) ?? null,
        order: data.order,
        published: data.published,
      },
    });

    revalidatePath("/");
    revalidatePath(`/khu-vuc/${existing.slug}`);
    revalidatePath(`/khu-vuc/${item.slug}`);
    return NextResponse.json(serialize(item));
  } catch (e) {
    console.error(e);
    return jsonError("Không cập nhật được", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const existing = await prisma.location.findUnique({ where: { id: params.id } });
  if (!existing) return jsonError("Không tìm thấy", 404);
  await prisma.location.delete({ where: { id: params.id } });
  revalidatePath("/");
  revalidatePath(`/khu-vuc/${existing.slug}`);
  return NextResponse.json({ ok: true });
}
