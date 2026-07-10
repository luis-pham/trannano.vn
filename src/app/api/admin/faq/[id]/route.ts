import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { faqSchema } from "@/lib/validators";
import { jsonError, zodError, nullIfEmpty } from "@/lib/api";

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const item = await prisma.faq.findUnique({ where: { id: params.id } });
  if (!item) return jsonError("Không tìm thấy", 404);
  return NextResponse.json(item);
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  try {
    const existing = await prisma.faq.findUnique({ where: { id: params.id } });
    if (!existing) return jsonError("Không tìm thấy", 404);

    const body = await request.json();
    const parsed = faqSchema.safeParse(body);
    if (!parsed.success) return zodError(parsed.error);
    const data = parsed.data;

    const item = await prisma.faq.update({
      where: { id: params.id },
      data: {
        question: data.question,
        answer: data.answer,
        serviceId: nullIfEmpty(data.serviceId) ?? null,
        order: data.order,
        published: data.published,
      },
    });

    revalidatePath("/faq");
    revalidatePath("/dich-vu");
    return NextResponse.json(item);
  } catch (e) {
    console.error(e);
    return jsonError("Không cập nhật được", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const existing = await prisma.faq.findUnique({ where: { id: params.id } });
  if (!existing) return jsonError("Không tìm thấy", 404);
  await prisma.faq.delete({ where: { id: params.id } });
  revalidatePath("/faq");
  revalidatePath("/dich-vu");
  return NextResponse.json({ ok: true });
}
