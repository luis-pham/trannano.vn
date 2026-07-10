import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { priceSchema } from "@/lib/validators";
import { jsonError, zodError, nullIfEmpty } from "@/lib/api";

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const item = await prisma.priceItem.findUnique({
    where: { id: params.id },
    include: { service: true },
  });
  if (!item) return jsonError("Không tìm thấy", 404);
  return NextResponse.json(item);
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  try {
    const existing = await prisma.priceItem.findUnique({ where: { id: params.id } });
    if (!existing) return jsonError("Không tìm thấy", 404);

    const body = await request.json();
    const parsed = priceSchema.safeParse(body);
    if (!parsed.success) return zodError(parsed.error);
    const data = parsed.data;

    const item = await prisma.priceItem.update({
      where: { id: params.id },
      data: {
        name: data.name,
        priceFrom: data.priceFrom,
        unit: data.unit,
        note: nullIfEmpty(data.note) ?? null,
        serviceId: nullIfEmpty(data.serviceId) ?? null,
        order: data.order,
      },
      include: { service: true },
    });

    revalidatePath("/bang-gia");
    return NextResponse.json(item);
  } catch (e) {
    console.error(e);
    return jsonError("Không cập nhật được", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const existing = await prisma.priceItem.findUnique({ where: { id: params.id } });
  if (!existing) return jsonError("Không tìm thấy", 404);
  await prisma.priceItem.delete({ where: { id: params.id } });
  revalidatePath("/bang-gia");
  return NextResponse.json({ ok: true });
}
