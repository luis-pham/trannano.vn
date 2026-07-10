"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import DataTable from "@/components/admin/DataTable";

type PriceRow = {
  id: string;
  name: string;
  priceFrom: number;
  unit: string;
  order: number;
  service?: { title: string } | null;
};

function formatPrice(n: number) {
  return new Intl.NumberFormat("vi-VN").format(n);
}

export default function PricesListPage() {
  const [rows, setRows] = useState<PriceRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    fetch("/api/admin/prices")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRows(data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(row: PriceRow) {
    if (!window.confirm(`Xóa mục "${row.name}"?`)) return;
    const res = await fetch(`/api/admin/prices/${row.id}`, { method: "DELETE" });
    if (res.ok) load();
    else {
      const data = await res.json();
      alert(data.error || "Không xóa được");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Bảng giá</h1>
        <Link href="/admin/prices/new" className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
          Thêm mới
        </Link>
      </div>
      {loading ? (
        <p className="text-sm text-gray-500">Đang tải...</p>
      ) : (
        <DataTable
          rows={rows}
          editHref={(row) => `/admin/prices/${row.id}`}
          onDelete={handleDelete}
          columns={[
            { key: "name", label: "Tên hạng mục" },
            {
              key: "priceFrom",
              label: "Giá từ",
              render: (row) => `${formatPrice(row.priceFrom)} đ/${row.unit}`,
            },
            {
              key: "service",
              label: "Dịch vụ",
              render: (row) => row.service?.title || "—",
            },
            { key: "order", label: "Thứ tự" },
          ]}
        />
      )}
    </div>
  );
}
