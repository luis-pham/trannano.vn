import Link from "next/link";
import { getSiteSettings, phoneTel, zaloLink } from "@/lib/seo";
import { BRAND_LOGO, BRAND_TAGLINE, COMPANY_NAME } from "@/lib/brand";
import { prisma } from "@/lib/prisma";

export default async function Footer() {
  const [settings, locations] = await Promise.all([
    getSiteSettings(),
    prisma.location.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { slug: true, title: true },
    }),
  ]);

  const footerLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/gioi-thieu", label: "Giới thiệu" },
    { href: "/dich-vu", label: "Dịch vụ" },
    { href: "/khu-vuc", label: "Khu vực" },
    { href: "/du-an", label: "Dự án" },
    { href: "/bang-gia", label: "Bảng giá" },
    { href: "/faq", label: "FAQ" },
    { href: "/blog", label: "Blog" },
    { href: "/lien-he", label: "Liên hệ" },
  ];

  return (
    <footer className="mt-auto border-t border-brand-dark bg-brand text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xl font-bold tracking-tight">{BRAND_LOGO}</p>
            <p className="mt-1 text-sm font-medium text-accent">{BRAND_TAGLINE}</p>
            <p className="mt-3 text-sm text-white/80">{COMPANY_NAME}</p>
            <p className="mt-2 text-sm text-white/70">
              Thi công trần nhựa nano, ốp tường, sàn nhựa giả gỗ tại Ninh Bình, Thanh Hoá, Hà Nam.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
              Liên hệ
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href={phoneTel(settings.phone)} className="hover:text-accent">
                  {settings.phone}
                </a>
              </li>
              {settings.address && <li className="text-white/80">{settings.address}</li>}
              <li className="text-white/80">{settings.workingHours}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
              Khu vực phục vụ
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {locations.map((loc) => (
                <li key={loc.slug}>
                  <Link href={`/khu-vuc/${loc.slug}`} className="text-white/80 hover:text-accent">
                    {loc.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/khu-vuc" className="text-accent hover:underline">
                  Xem tất cả khu vực →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
              Liên kết
            </h3>
            <ul className="mt-3 grid grid-cols-2 gap-1 text-sm">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/80 hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              <a
                href={settings.facebookUrl || "https://www.facebook.com/trannhuanano"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/80 hover:text-accent"
              >
                Facebook
              </a>
              <a
                href={settings.googleBusinessUrl || "https://maps.app.goo.gl/WZ7Mh8CeyY5Frvxw6"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/80 hover:text-accent"
              >
                Google Map
              </a>
              <a
                href={zaloLink(settings.phone, settings.zaloUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/80 hover:text-accent"
              >
                Zalo
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm text-white/60">
          © {new Date().getFullYear()} {COMPANY_NAME} · {BRAND_LOGO}. Bảo lưu mọi quyền.
        </div>
      </div>
    </footer>
  );
}
