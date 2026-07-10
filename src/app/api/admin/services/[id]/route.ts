import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { serviceSchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slugify";
import { parseImages, stringifyImages } from "@/lib/images";
import { jsonError, zodError, nullIfEmpty } from "@/lib/api";

function serialize(service: { images: string; [key: string]: unknown }) {
  return { ...service, images: parseImages(service.images) };
}

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const item = await prisma.service.findUnique({ where: { id: params.id } });
  if (!item) return jsonError("Không tìm thấy", 404);
  return NextResponse.json(serialize(item));
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  try {
    const existing = await prisma.service.findUnique({ where: { id: params.id } });
    if (!existing) return jsonError("Không tìm thấy", 404);

    const body = await request.json();
    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) return zodError(parsed.error);
    const data = parsed.data;

    let slug = existing.slug;
    if (data.slug && data.slug !== existing.slug) {
      slug = await uniqueSlug(data.slug, async (s) => {
        const found = await prisma.service.findFirst({
          where: { slug: s, NOT: { id: params.id } },
        });
        return Boolean(found);
      });
    }

    const item = await prisma.service.update({
      where: { id: params.id },
      data: {
        title: data.title,
        slug,
        shortDescription: nullIfEmpty(data.shortDescription) ?? null,
        content: data.content,
        images: stringifyImages(data.images),
        iconUrl: nullIfEmpty(data.iconUrl) ?? null,
        metaTitle: nullIfEmpty(data.metaTitle) ?? null,
        metaDescription: nullIfEmpty(data.metaDescription) ?? null,
        ogImage: nullIfEmpty(data.ogImage) ?? null,
        order: data.order,
        published: data.published,
      },
    });

    revalidateTag("services");
    revalidatePath("/");
    revalidatePath("/dich-vu");
    revalidatePath(`/dich-vu/${existing.slug}`);
    revalidatePath(`/dich-vu/${item.slug}`);
    return NextResponse.json(serialize(item));
  } catch (e) {
    console.error(e);
    return jsonError("Không cập nhật được", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const existing = await prisma.service.findUnique({ where: { id: params.id } });
  if (!existing) return jsonError("Không tìm thấy", 404);
  await prisma.service.delete({ where: { id: params.id } });
  revalidateTag("services");
  revalidatePath("/");
  revalidatePath("/dich-vu");
  revalidatePath(`/dich-vu/${existing.slug}`);
  return NextResponse.json({ ok: true });
}
