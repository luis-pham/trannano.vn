"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminFormShell, { inputClass, labelClass } from "./AdminFormShell";

type ServiceOption = { id: string; title: string };

type PriceFormData = {
  name: string;
  priceFrom: number;
  unit: string;
  note: string;
  serviceId: string;
  order: number;
};

const empty: PriceFormData = {
  name: "",
  priceFrom: 0,
  unit: "m2",
  note: "",
  serviceId: "",
  order: 0,
};

export default function PriceForm({ id }: { id?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<PriceFormData>(empty);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setServices(data.map((s: ServiceOption) => ({ id: s.id, title: s.title })));
        }
      });
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/prices/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setMessage({ type: "error", text: data.error });
          return;
        }
        setForm({
          name: data.name || "",
          priceFrom: data.priceFrom ?? 0,
          unit: data.unit || "m2",
          note: data.note || "",
          serviceId: data.serviceId || "",
          order: data.order ?? 0,
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const url = id ? `/api/admin/prices/${id}` : "/api/admin/prices";
    const res = await fetch(url, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        note: form.note || null,
        serviceId: form.serviceId || null,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage({ type: "error", text: data.error || "Lỗi lưu dữ liệu" });
    } else {
      setMessage({ type: "success", text: "Đã lưu" });
      if (!id) router.push(`/admin/prices/${data.id}`);
    }
    setSaving(false);
  }

  if (loading) return <p className="text-sm text-gray-500">Đang tải...</p>;

  return (
    <AdminFormShell
      title={id ? "Sửa mục bảng giá" : "Thêm mục bảng giá"}
      onSubmit={handleSubmit}
      saving={saving}
      message={message}
      onDismissMessage={() => setMessage(null)}
    >
      <div>
        <label className={labelClass}>Tên hạng mục *</label>
        <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Giá từ (VNĐ) *</label>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={form.priceFrom}
            onChange={(e) => setForm({ ...form, priceFrom: Number(e.target.value) })}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Đơn vị</label>
          <input className={inputClass} value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="m2" />
        </div>
      </div>
      <div>
        <label className={labelClass}>Ghi chú</label>
        <textarea className={inputClass} rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
      </div>
      <div>
        <label className={labelClass}>Dịch vụ</label>
        <select className={inputClass} value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })}>
          <option value="">— Không chọn —</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>Thứ tự</label>
        <input type="number" className={inputClass} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
      </div>
    </AdminFormShell>
  );
}
