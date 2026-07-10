import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/seo";
import { BRAND_LOGO, BRAND_TAGLINE } from "@/lib/brand";
import HeaderNav from "./HeaderNav";

export default async function Header() {
  const [settings, services, locations] = await Promise.all([
    getSiteSettings(),
    prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { slug: true, title: true },
    }),
    prisma.location.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { slug: true, title: true },
    }),
  ]);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-xl font-bold text-brand">{BRAND_LOGO}</span>
          <span className="hidden text-[11px] font-medium text-gray-500 sm:block">
            {BRAND_TAGLINE}
          </span>
        </Link>
        <HeaderNav phone={settings.phone} services={services} locations={locations} />
      </div>
    </header>
  );
}
