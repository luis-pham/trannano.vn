"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/admin/DataTable";

type PageRow = {
  id: string;
  title: string;
  slug: string;
};

export default function PagesListPage() {
  const [rows, setRows] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/pages")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRows(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-900">Trang tĩnh</h1>
      <p className="mb-4 text-sm text-gray-500">Chỉ chỉnh sửa nội dung các trang có sẵn.</p>
      {loading ? (
        <p className="text-sm text-gray-500">Đang tải...</p>
      ) : (
        <DataTable
          rows={rows}
          editHref={(row) => `/admin/pages/${row.id}`}
          columns={[
            { key: "title", label: "Tiêu đề" },
            { key: "slug", label: "Slug" },
          ]}
        />
      )}
    </div>
  );
}
