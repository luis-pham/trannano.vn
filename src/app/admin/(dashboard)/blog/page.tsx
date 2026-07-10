"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import DataTable from "@/components/admin/DataTable";

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  publishedAt?: string;
};

export default function BlogListPage() {
  const [rows, setRows] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRows(data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(row: BlogRow) {
    if (!window.confirm(`Xóa bài viết "${row.title}"?`)) return;
    const res = await fetch(`/api/admin/blog/${row.id}`, { method: "DELETE" });
    if (res.ok) load();
    else {
      const data = await res.json();
      alert(data.error || "Không xóa được");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Blog</h1>
        <Link href="/admin/blog/new" className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
          Thêm mới
        </Link>
      </div>
      {loading ? (
        <p className="text-sm text-gray-500">Đang tải...</p>
      ) : (
        <DataTable
          rows={rows}
          editHref={(row) => `/admin/blog/${row.id}`}
          onDelete={handleDelete}
          columns={[
            { key: "title", label: "Tiêu đề" },
            { key: "slug", label: "Slug" },
            {
              key: "published",
              label: "Trạng thái",
              render: (row) => (row.published ? "Đã xuất bản" : "Nháp"),
            },
            {
              key: "publishedAt",
              label: "Ngày đăng",
              render: (row) => (row.publishedAt ? String(row.publishedAt).slice(0, 10) : "—"),
            },
          ]}
        />
      )}
    </div>
  );
}
