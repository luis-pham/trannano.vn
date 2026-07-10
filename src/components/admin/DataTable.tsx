"use client";

import Link from "next/link";

export type Column<T extends Record<string, unknown>> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type DataTableProps<T extends Record<string, unknown>> = {
  columns: Column<T>[];
  rows: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  editHref?: (row: T) => string;
  idKey?: string;
};

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  onEdit,
  onDelete,
  editHref,
  idKey = "id",
}: DataTableProps<T>) {
  const hasActions = Boolean(onEdit || onDelete || editHref);

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-500">
        Không có dữ liệu
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left font-medium text-gray-600">
                {col.label}
              </th>
            ))}
            {hasActions && (
              <th className="px-4 py-3 text-right font-medium text-gray-600">Thao tác</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => {
            const rowId = String(row[idKey] ?? "");
            return (
              <tr key={rowId} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-gray-800">
                    {col.render ? col.render(row) : String(row[col.key] ?? "")}
                  </td>
                ))}
                {hasActions && (
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {editHref && (
                      <Link
                        href={editHref(row)}
                        className="mr-3 text-brand hover:underline"
                      >
                        Sửa
                      </Link>
                    )}
                    {onEdit && !editHref && (
                      <button
                        type="button"
                        onClick={() => onEdit(row)}
                        className="mr-3 text-brand hover:underline"
                      >
                        Sửa
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(row)}
                        className="text-red-600 hover:underline"
                      >
                        Xóa
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
