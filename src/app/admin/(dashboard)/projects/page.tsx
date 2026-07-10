"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import DataTable from "@/components/admin/DataTable";

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  location?: { title: string } | null;
};

export default function ProjectsListPage() {
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    fetch("/api/admin/projects")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRows(data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(row: ProjectRow) {
    if (!window.confirm(`Xóa dự án "${row.title}"?`)) return;
    const res = await fetch(`/api/admin/projects/${row.id}`, { method: "DELETE" });
    if (res.ok) load();
    else {
      const data = await res.json();
      alert(data.error || "Không xóa được");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Dự án</h1>
        <Link href="/admin/projects/new" className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
          Thêm mới
        </Link>
      </div>
      {loading ? (
        <p className="text-sm text-gray-500">Đang tải...</p>
      ) : (
        <DataTable
          rows={rows}
          editHref={(row) => `/admin/projects/${row.id}`}
          onDelete={handleDelete}
          columns={[
            { key: "title", label: "Tiêu đề" },
            { key: "slug", label: "Slug" },
            {
              key: "location",
              label: "Khu vực",
              render: (row) => row.location?.title || "—",
            },
            {
              key: "published",
              label: "Trạng thái",
              render: (row) => (row.published ? "Đã xuất bản" : "Nháp"),
            },
          ]}
        />
      )}
    </div>
  );
}
