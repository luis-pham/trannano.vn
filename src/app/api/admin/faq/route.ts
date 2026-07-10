import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { faqSchema } from "@/lib/validators";
import { jsonError, zodError, nullIfEmpty } from "@/lib/api";

export async function GET() {
  const items = await prisma.faq.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = faqSchema.safeParse(body);
    if (!parsed.success) return zodError(parsed.error);
    const data = parsed.data;

    const item = await prisma.faq.create({
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
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    console.error(e);
    return jsonError("Không tạo được FAQ", 500);
  }
}
