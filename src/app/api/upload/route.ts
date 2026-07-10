import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadImageBuffer } from "@/lib/upload";
import { jsonError } from "@/lib/api";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);

  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((f): f is File => f instanceof File);
    if (files.length === 0) return jsonError("Không có file nào");

    const urls: string[] = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        return jsonError(`File ${file.name} vượt quá 5MB`);
      }
      if (!file.type.startsWith("image/")) {
        return jsonError(`File ${file.name} không phải ảnh`);
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const url = await uploadImageBuffer(buffer, file.name);
      urls.push(url);
    }

    return NextResponse.json({ urls });
  } catch (e) {
    console.error(e);
    return jsonError("Upload thất bại", 500);
  }
}
