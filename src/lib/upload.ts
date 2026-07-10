import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { isR2Configured, uploadToR2 } from "@/lib/r2";

async function uploadLocal(buffer: Buffer, filename: string): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const ext = path.extname(filename) || ".jpg";
  const name = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
  await writeFile(path.join(uploadsDir, name), buffer);
  return `/uploads/${name}`;
}

/** Prefer Cloudflare R2; fall back to local `public/uploads` when R2 env is missing. */
export async function uploadImageBuffer(
  buffer: Buffer,
  filename: string
): Promise<string> {
  if (isR2Configured()) {
    return uploadToR2(buffer, filename);
  }
  return uploadLocal(buffer, filename);
}
