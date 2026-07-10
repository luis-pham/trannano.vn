import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import path from "path";

function getR2Config() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  const publicUrl = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) {
    return null;
  }

  return { accountId, accessKeyId, secretAccessKey, bucket, publicUrl };
}

export function isR2Configured() {
  return Boolean(getR2Config());
}

function getClient(accountId: string, accessKeyId: string, secretAccessKey: string) {
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

function contentTypeFor(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".avif": "image/avif",
    ".svg": "image/svg+xml",
  };
  return map[ext] || "application/octet-stream";
}

/** Upload buffer to R2; returns public URL. Throws if R2 is not configured. */
export async function uploadToR2(buffer: Buffer, filename: string): Promise<string> {
  const config = getR2Config();
  if (!config) {
    throw new Error("Cloudflare R2 chưa được cấu hình (thiếu biến môi trường).");
  }

  const ext = path.extname(filename) || ".jpg";
  const key = `uploads/${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;

  const client = getClient(config.accountId, config.accessKeyId, config.secretAccessKey);
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentTypeFor(filename),
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return `${config.publicUrl}/${key}`;
}
