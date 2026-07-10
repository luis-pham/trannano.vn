"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Counts = {
  services: number;
  projects: number;
  blog: number;
};

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Counts>({ services: 0, projects: 0, blog: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/services").then((r) => r.json()),
      fetch("/api/admin/projects").then((r) => r.json()),
      fetch("/api/admin/blog").then((r) => r.json()),
    ])
      .then(([services, projects, blog]) => {
        setCounts({
          services: Array.isArray(services) ? services.filter((s: { published?: boolean }) => s.published).length : 0,
          projects: Array.isArray(projects) ? projects.filter((p: { published?: boolean }) => p.published).length : 0,
          blog: Array.isArray(blog) ? blog.filter((b: { published?: boolean }) => b.published).length : 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const shortcuts = [
    { href: "/admin/services/new", label: "Thêm dịch vụ" },
    { href: "/admin/projects/new", label: "Thêm dự án" },
    { href: "/admin/blog/new", label: "Thêm bài viết" },
    { href: "/admin/settings", label: "Cấu hình website" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-900">Dashboard</h1>

      {loading ? (
        <p className="text-sm text-gray-500">Đang tải...</p>
      ) : (
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">Dịch vụ đã xuất bản</p>
            <p className="mt-1 text-2xl font-semibold text-brand">{counts.services}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">Dự án đã xuất bản</p>
            <p className="mt-1 text-2xl font-semibold text-brand">{counts.projects}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">Bài blog đã xuất bản</p>
            <p className="mt-1 text-2xl font-semibold text-brand">{counts.blog}</p>
          </div>
        </div>
      )}

      <h2 className="mb-3 text-sm font-medium text-gray-700">Lối tắt</h2>
      <div className="flex flex-wrap gap-2">
        {shortcuts.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:border-brand hover:text-brand"
          >
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
