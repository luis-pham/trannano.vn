"use client";

import Link from "next/link";
import { useState } from "react";
import { phoneTel } from "@/lib/seo";

type NavService = { slug: string; title: string };
type NavLocation = { slug: string; title: string };

type HeaderNavProps = {
  phone: string;
  services: NavService[];
  locations: NavLocation[];
};

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/du-an", label: "Dự án đã hoàn thành" },
  { href: "/bang-gia", label: "Bảng giá" },
  { href: "/blog", label: "Blog" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function HeaderNav({ phone, services, locations }: HeaderNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <>
      <nav className="hidden items-center gap-1 lg:flex">
        {navLinks.slice(0, 1).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-surface hover:text-brand"
          >
            {link.label}
          </Link>
        ))}

        <div
          className="relative"
          onMouseEnter={() => setOpenDropdown("services")}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <Link
            href="/dich-vu"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-surface hover:text-brand"
          >
            Dịch vụ
          </Link>
          {openDropdown === "services" && services.length > 0 && (
            <div className="absolute left-0 top-full z-50 min-w-[220px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/dich-vu/${s.slug}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-surface hover:text-brand"
                >
                  {s.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div
          className="relative"
          onMouseEnter={() => setOpenDropdown("locations")}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <Link
            href="/khu-vuc"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-surface hover:text-brand"
          >
            Khu vực
          </Link>
          {openDropdown === "locations" && locations.length > 0 && (
            <div className="absolute left-0 top-full z-50 min-w-[180px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
              <Link
                href="/khu-vuc"
                className="block border-b border-gray-100 px-4 py-2 text-sm font-medium text-brand hover:bg-surface"
              >
                Tất cả khu vực
              </Link>
              {locations.map((l) => (
                <Link
                  key={l.slug}
                  href={`/khu-vuc/${l.slug}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-surface hover:text-brand"
                >
                  {l.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {navLinks.slice(1).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-surface hover:text-brand"
          >
            {link.label}
          </Link>
        ))}

        <a
          href={phoneTel(phone)}
          className="ml-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-brand hover:bg-accent-light active:scale-[0.98]"
        >
          {phone}
        </a>
      </nav>

      <div className="flex items-center gap-2 lg:hidden">
        <a
          href={phoneTel(phone)}
          className="rounded-full bg-accent px-3 py-2 text-sm font-semibold text-brand"
        >
          Gọi Ngay
        </a>
        <button
          type="button"
          className="rounded-lg p-2 text-gray-700 hover:bg-surface"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full z-50 border-t border-gray-200 bg-white px-4 py-4 shadow-lg lg:hidden">
          <div className="space-y-1">
            <Link
              href="/"
              className="block rounded-lg px-3 py-2 font-medium text-gray-900 hover:bg-surface"
              onClick={() => setMobileOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              href="/dich-vu"
              className="block rounded-lg px-3 py-2 font-medium text-gray-900 hover:bg-surface"
              onClick={() => setMobileOpen(false)}
            >
              Dịch vụ
            </Link>
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/dich-vu/${s.slug}`}
                className="block rounded-lg py-1.5 pl-6 text-sm text-gray-600 hover:text-brand"
                onClick={() => setMobileOpen(false)}
              >
                {s.title}
              </Link>
            ))}
            <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Khu vực
            </p>
            <Link
              href="/khu-vuc"
              className="block rounded-lg py-1.5 pl-6 text-sm font-medium text-brand hover:text-brand-dark"
              onClick={() => setMobileOpen(false)}
            >
              Tất cả khu vực
            </Link>
            {locations.map((l) => (
              <Link
                key={l.slug}
                href={`/khu-vuc/${l.slug}`}
                className="block rounded-lg py-1.5 pl-6 text-sm text-gray-600 hover:text-brand"
                onClick={() => setMobileOpen(false)}
              >
                {l.title}
              </Link>
            ))}
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2 font-medium text-gray-900 hover:bg-surface"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
