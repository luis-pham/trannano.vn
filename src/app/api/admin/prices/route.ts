import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { priceSchema } from "@/lib/validators";
import { jsonError, zodError, nullIfEmpty } from "@/lib/api";

export async function GET() {
  const items = await prisma.priceItem.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { service: true },
  });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = priceSchema.safeParse(body);
    if (!parsed.success) return zodError(parsed.error);
    const data = parsed.data;

    const item = await prisma.priceItem.create({
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
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    console.error(e);
    return jsonError("Không tạo được mục bảng giá", 500);
  }
}
