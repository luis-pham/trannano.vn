import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slugify";
import { parseImages, stringifyImages } from "@/lib/images";
import { jsonError, zodError, nullIfEmpty } from "@/lib/api";

function parseProjectDate(value?: string | null): Date | null {
  if (value === undefined || value === null || value.trim() === "") return null;
  return new Date(value);
}

function serializeLocation(location: { images: string; [key: string]: unknown } | null) {
  if (!location) return null;
  return { ...location, images: parseImages(location.images) };
}

function serialize(project: {
  images: string;
  location?: { images: string; [key: string]: unknown } | null;
  [key: string]: unknown;
}) {
  return {
    ...project,
    images: parseImages(project.images),
    location: serializeLocation(project.location ?? null),
  };
}

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const item = await prisma.project.findUnique({
    where: { id: params.id },
    include: { location: true },
  });
  if (!item) return jsonError("Không tìm thấy", 404);
  return NextResponse.json(serialize(item));
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  try {
    const existing = await prisma.project.findUnique({ where: { id: params.id } });
    if (!existing) return jsonError("Không tìm thấy", 404);

    const body = await request.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) return zodError(parsed.error);
    const data = parsed.data;

    let slug = existing.slug;
    if (data.slug && data.slug !== existing.slug) {
      slug = await uniqueSlug(data.slug, async (s) => {
        const found = await prisma.project.findFirst({
          where: { slug: s, NOT: { id: params.id } },
        });
        return Boolean(found);
      });
    }

    const item = await prisma.project.update({
      where: { id: params.id },
      data: {
        title: data.title,
        slug,
        content: data.content,
        images: stringifyImages(data.images),
        projectDate: parseProjectDate(data.projectDate),
        locationId: nullIfEmpty(data.locationId) ?? null,
        metaTitle: nullIfEmpty(data.metaTitle) ?? null,
        metaDescription: nullIfEmpty(data.metaDescription) ?? null,
        ogImage: nullIfEmpty(data.ogImage) ?? null,
        published: data.published,
      },
      include: { location: true },
    });

    revalidatePath("/");
    revalidatePath("/du-an");
    revalidatePath(`/du-an/${existing.slug}`);
    revalidatePath(`/du-an/${item.slug}`);
    return NextResponse.json(serialize(item));
  } catch (e) {
    console.error(e);
    return jsonError("Không cập nhật được", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const existing = await prisma.project.findUnique({ where: { id: params.id } });
  if (!existing) return jsonError("Không tìm thấy", 404);
  await prisma.project.delete({ where: { id: params.id } });
  revalidatePath("/");
  revalidatePath("/du-an");
  revalidatePath(`/du-an/${existing.slug}`);
  return NextResponse.json({ ok: true });
}
