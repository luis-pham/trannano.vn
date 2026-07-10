#!/usr/bin/env tsx
/**
 * Kiểm tra số bản ghi trên DB hiện tại (DATABASE_URL).
 * Usage: DATABASE_URL="postgresql://..." npx tsx scripts/check-seed.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const counts = {
    AdminUser: await prisma.adminUser.count(),
    SiteSettings: await prisma.siteSettings.count(),
    Page: await prisma.page.count(),
    Service: await prisma.service.count(),
    ServicePublished: await prisma.service.count({ where: { published: true } }),
    Location: await prisma.location.count(),
    LocationPublished: await prisma.location.count({ where: { published: true } }),
    Project: await prisma.project.count(),
    ProjectPublished: await prisma.project.count({ where: { published: true } }),
    BlogPost: await prisma.blogPost.count(),
    BlogPublished: await prisma.blogPost.count({ where: { published: true } }),
    Faq: await prisma.faq.count(),
    FaqPublished: await prisma.faq.count({ where: { published: true } }),
    PriceItem: await prisma.priceItem.count(),
  };

  console.log("DATABASE_URL host:", process.env.DATABASE_URL?.replace(/:[^:@/]+@/, ":***@"));
  console.table(counts);

  const expected = {
    AdminUser: 1,
    SiteSettings: 1,
    Page: 3,
    Service: 5,
    Location: 3,
    Project: 3,
    BlogPost: 3,
    Faq: 3,
    PriceItem: 3,
  };

  const missing = Object.entries(expected).filter(
    ([k, v]) => (counts as Record<string, number>)[k] < v
  );
  if (missing.length) {
    console.log("\n⚠️  Seed chưa đủ. Thiếu/thấp hơn kỳ vọng:");
    for (const [k, v] of missing) {
      console.log(`  - ${k}: có ${(counts as Record<string, number>)[k]}, kỳ vọng >= ${v}`);
    }
    console.log("\nChạy lại seed với DIRECT URL (port 5432):");
    console.log('  DATABASE_URL="postgresql://postgres:PASS@db.xxx.supabase.co:5432/postgres?sslmode=require" npx tsx prisma/seed.ts');
    process.exitCode = 1;
  } else {
    console.log("\n✅ Seed đủ số lượng tối thiểu.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
