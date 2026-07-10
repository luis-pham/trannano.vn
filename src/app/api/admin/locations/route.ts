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

export async function GET() {
  const items = await prisma.location.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json(items.map(serialize));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = locationSchema.safeParse(body);
    if (!parsed.success) return zodError(parsed.error);
    const data = parsed.data;

    const slug = await uniqueSlug(data.slug || data.title, async (s) => {
      const found = await prisma.location.findUnique({ where: { slug: s } });
      return Boolean(found);
    });

    const item = await prisma.location.create({
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
    revalidatePath(`/khu-vuc/${item.slug}`);
    return NextResponse.json(serialize(item), { status: 201 });
  } catch (e) {
    console.error(e);
    return jsonError("Không tạo được khu vực", 500);
  }
}
