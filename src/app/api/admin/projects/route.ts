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

export async function GET() {
  const items = await prisma.project.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: { location: true },
  });
  return NextResponse.json(items.map(serialize));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) return zodError(parsed.error);
    const data = parsed.data;

    const slug = await uniqueSlug(data.slug || data.title, async (s) => {
      const found = await prisma.project.findUnique({ where: { slug: s } });
      return Boolean(found);
    });

    const item = await prisma.project.create({
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
    revalidatePath(`/du-an/${item.slug}`);
    return NextResponse.json(serialize(item), { status: 201 });
  } catch (e) {
    console.error(e);
    return jsonError("Không tạo được dự án", 500);
  }
}
