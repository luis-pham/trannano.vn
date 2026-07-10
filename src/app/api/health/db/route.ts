import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function diagnoseDatabaseUrl(databaseUrl: string) {
  const looksLikePostgres =
    databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("postgres://");
  const isPooler = /pooler\.supabase\.com|:6543\b/i.test(databaseUrl);
  const hasPgBouncer = /(?:\?|&)pgbouncer=true(?:&|$)/i.test(databaseUrl);
  const hostMatch = databaseUrl.match(/@([^/?]+)/);
  const host = hostMatch?.[1] || null;

  return { looksLikePostgres, isPooler, hasPgBouncer, host };
}

/**
 * Kiểm tra Vercel có nối được Supabase không.
 * Mở: https://your-app.vercel.app/api/health/db
 */
export async function GET() {
  const databaseUrl = process.env.DATABASE_URL || "";
  const { looksLikePostgres, isPooler, hasPgBouncer, host } =
    diagnoseDatabaseUrl(databaseUrl);

  if (isPooler && !hasPgBouncer) {
    return NextResponse.json(
      {
        ok: false,
        connected: false,
        host,
        looksLikePostgres,
        isPooler,
        hasPgBouncer: false,
        error: "DATABASE_URL dùng Supabase pooler nhưng thiếu ?pgbouncer=true",
        hint:
          "Trên Vercel → Settings → Environment Variables, sửa DATABASE_URL thành dạng: " +
          "postgresql://postgres.PROJECT:PASSWORD@aws-0-....pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1 " +
          "rồi Redeploy. Thiếu pgbouncer=true khiến trang lúc có data lúc trống.",
      },
      { status: 500 }
    );
  }

  try {
    const [
      adminUser,
      siteSettings,
      page,
      service,
      servicePublished,
      location,
      locationPublished,
      project,
      projectPublished,
      blogPost,
      blogPublished,
      faq,
      faqPublished,
      priceItem,
    ] = await Promise.all([
      prisma.adminUser.count(),
      prisma.siteSettings.count(),
      prisma.page.count(),
      prisma.service.count(),
      prisma.service.count({ where: { published: true } }),
      prisma.location.count(),
      prisma.location.count({ where: { published: true } }),
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.faq.count(),
      prisma.faq.count({ where: { published: true } }),
      prisma.priceItem.count(),
    ]);

    const counts = {
      adminUser,
      siteSettings,
      page,
      service,
      servicePublished,
      location,
      locationPublished,
      project,
      projectPublished,
      blogPost,
      blogPublished,
      faq,
      faqPublished,
      priceItem,
    };

    const expectedMin = {
      service: 5,
      location: 3,
      project: 3,
      blogPost: 3,
      faq: 3,
      page: 3,
    };

    const missing = Object.entries(expectedMin)
      .filter(([k, min]) => (counts as Record<string, number>)[k] < min)
      .map(([k, min]) => `${k}: có ${(counts as Record<string, number>)[k]}, cần >= ${min}`);

    return NextResponse.json({
      ok: true,
      connected: true,
      host,
      looksLikePostgres,
      isPooler,
      hasPgBouncer,
      counts,
      seedComplete: missing.length === 0,
      missing,
      hint:
        missing.length > 0
          ? "DB nối được nhưng seed chưa đủ. Chạy lại prisma/seed.ts với Direct URL."
          : "DB + seed OK. Nếu trang vẫn trống, Redeploy Vercel để xóa cache.",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const preparedStatementBug =
      /prepared statement|08P01|bind message supplies/i.test(message);

    return NextResponse.json(
      {
        ok: false,
        connected: false,
        host,
        looksLikePostgres,
        isPooler,
        hasPgBouncer,
        error: message,
        hint: preparedStatementBug
          ? "Lỗi Prisma + PgBouncer: thêm ?pgbouncer=true&connection_limit=1 vào DATABASE_URL trên Vercel rồi Redeploy."
          : !looksLikePostgres
            ? "Vercel thiếu DATABASE_URL postgresql://... Hãy thêm env Production rồi Redeploy."
            : "Vercel không kết nối được Supabase. Kiểm tra password, dùng pooler :6543?pgbouncer=true, Redeploy.",
      },
      { status: 500 }
    );
  }
}
