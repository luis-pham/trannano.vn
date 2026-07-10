import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { pageSchema } from "@/lib/validators";
import { jsonError, zodError, nullIfEmpty } from "@/lib/api";

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const item = await prisma.page.findUnique({ where: { id: params.id } });
  if (!item) return jsonError("Không tìm thấy", 404);
  return NextResponse.json(item);
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  try {
    const existing = await prisma.page.findUnique({ where: { id: params.id } });
    if (!existing) return jsonError("Không tìm thấy", 404);

    const body = await request.json();
    const parsed = pageSchema.safeParse(body);
    if (!parsed.success) return zodError(parsed.error);
    const data = parsed.data;

    const item = await prisma.page.update({
      where: { id: params.id },
      data: {
        title: data.title,
        content: data.content,
        metaTitle: nullIfEmpty(data.metaTitle) ?? null,
        metaDescription: nullIfEmpty(data.metaDescription) ?? null,
        ogImage: nullIfEmpty(data.ogImage) ?? null,
      },
    });

    revalidatePath(`/${existing.slug}`);
    return NextResponse.json(item);
  } catch (e) {
    console.error(e);
    return jsonError("Không cập nhật được", 500);
  }
}
