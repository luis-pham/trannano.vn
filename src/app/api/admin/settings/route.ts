import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { settingsSchema } from "@/lib/validators";
import { jsonError, zodError, nullIfEmpty } from "@/lib/api";

export const dynamic = "force-dynamic";

const SETTINGS_ID = "singleton";

export async function GET() {
  let settings = await prisma.siteSettings.findUnique({ where: { id: SETTINGS_ID } });
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: { id: SETTINGS_ID } });
  }
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) return zodError(parsed.error);
    const data = parsed.data;

    const item = await prisma.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      create: {
        id: SETTINGS_ID,
        businessName: data.businessName,
        phone: data.phone,
        zaloUrl: nullIfEmpty(data.zaloUrl) ?? null,
        address: nullIfEmpty(data.address) ?? null,
        workingHours: data.workingHours,
        serviceAreas: data.serviceAreas,
        mapEmbedUrl: nullIfEmpty(data.mapEmbedUrl) ?? null,
        facebookUrl: nullIfEmpty(data.facebookUrl) ?? null,
        googleBusinessUrl: nullIfEmpty(data.googleBusinessUrl) ?? null,
        defaultMetaTitle: data.defaultMetaTitle,
        defaultMetaDescription: data.defaultMetaDescription,
        defaultOgImage: nullIfEmpty(data.defaultOgImage) ?? "",
      },
      update: {
        businessName: data.businessName,
        phone: data.phone,
        zaloUrl: nullIfEmpty(data.zaloUrl) ?? null,
        address: nullIfEmpty(data.address) ?? null,
        workingHours: data.workingHours,
        serviceAreas: data.serviceAreas,
        mapEmbedUrl: nullIfEmpty(data.mapEmbedUrl) ?? null,
        facebookUrl: nullIfEmpty(data.facebookUrl) ?? null,
        googleBusinessUrl: nullIfEmpty(data.googleBusinessUrl) ?? null,
        defaultMetaTitle: data.defaultMetaTitle,
        defaultMetaDescription: data.defaultMetaDescription,
        defaultOgImage: nullIfEmpty(data.defaultOgImage) ?? "",
      },
    });

    revalidateTag("site-settings");
    revalidatePath("/", "layout");
    return NextResponse.json(item);
  } catch (e) {
    console.error(e);
    return jsonError("Không cập nhật được cấu hình", 500);
  }
}
