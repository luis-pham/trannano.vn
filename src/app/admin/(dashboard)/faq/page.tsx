"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import DataTable from "@/components/admin/DataTable";

type FaqRow = {
  id: string;
  question: string;
  published: boolean;
  order: number;
};

export default function FaqListPage() {
  const [rows, setRows] = useState<FaqRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    fetch("/api/admin/faq")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRows(data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(row: FaqRow) {
    if (!window.confirm(`Xóa FAQ "${row.question}"?`)) return;
    const res = await fetch(`/api/admin/faq/${row.id}`, { method: "DELETE" });
    if (res.ok) load();
    else {
      const data = await res.json();
      alert(data.error || "Không xóa được");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">FAQ</h1>
        <Link href="/admin/faq/new" className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
          Thêm mới
        </Link>
      </div>
      {loading ? (
        <p className="text-sm text-gray-500">Đang tải...</p>
      ) : (
        <DataTable
          rows={rows}
          editHref={(row) => `/admin/faq/${row.id}`}
          onDelete={handleDelete}
          columns={[
            { key: "question", label: "Câu hỏi" },
            {
              key: "published",
              label: "Trạng thái",
              render: (row) => (row.published ? "Đã xuất bản" : "Nháp"),
            },
            { key: "order", label: "Thứ tự" },
          ]}
        />
      )}
    </div>
  );
}
