import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await prisma.page.findMany({ orderBy: { title: "asc" } });
  return NextResponse.json(items);
}
