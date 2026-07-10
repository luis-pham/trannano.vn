"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/services", label: "Dịch vụ" },
  { href: "/admin/locations", label: "Khu vực" },
  { href: "/admin/projects", label: "Dự án" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/prices", label: "Bảng giá" },
  { href: "/admin/pages", label: "Trang tĩnh" },
  { href: "/admin/settings", label: "Cấu hình" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <aside className="hidden w-56 shrink-0 border-r border-gray-200 bg-white md:block">
        <div className="sticky top-0 flex h-screen flex-col">
          <div className="border-b border-gray-200 px-4 py-5">
            <p className="text-sm font-semibold text-brand">Trannano.vn</p>
            <p className="text-xs text-gray-500">Quản trị</p>
          </div>
          <nav className="flex-1 overflow-y-auto px-2 py-4">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-lg px-3 py-2 text-sm ${
                      isActive(link.href, link.exact)
                        ? "bg-brand/10 font-medium text-brand"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-gray-200 p-3">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-100"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      <div className="border-b border-gray-200 bg-white md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm font-semibold text-brand">Trannano.vn Admin</p>
          <button type="button" onClick={handleLogout} className="text-xs text-gray-600 underline">
            Đăng xuất
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${
                isActive(link.href, link.exact)
                  ? "bg-brand text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
