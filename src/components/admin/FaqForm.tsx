"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminFormShell, { inputClass, labelClass } from "./AdminFormShell";
import RichTextEditor from "./RichTextEditor";

type ServiceOption = { id: string; title: string };

type FaqFormData = {
  question: string;
  answer: string;
  serviceId: string;
  order: number;
  published: boolean;
};

const empty: FaqFormData = {
  question: "",
  answer: "",
  serviceId: "",
  order: 0,
  published: false,
};

export default function FaqForm({ id }: { id?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<FaqFormData>(empty);
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
    fetch(`/api/admin/faq/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setMessage({ type: "error", text: data.error });
          return;
        }
        setForm({
          question: data.question || "",
          answer: data.answer || "",
          serviceId: data.serviceId || "",
          order: data.order ?? 0,
          published: Boolean(data.published),
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const url = id ? `/api/admin/faq/${id}` : "/api/admin/faq";
    const res = await fetch(url, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        serviceId: form.serviceId || null,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage({ type: "error", text: data.error || "Lỗi lưu dữ liệu" });
    } else {
      setMessage({ type: "success", text: "Đã lưu" });
      if (!id) router.push(`/admin/faq/${data.id}`);
    }
    setSaving(false);
  }

  if (loading) return <p className="text-sm text-gray-500">Đang tải...</p>;

  return (
    <AdminFormShell
      title={id ? "Sửa FAQ" : "Thêm FAQ"}
      onSubmit={handleSubmit}
      saving={saving}
      message={message}
      onDismissMessage={() => setMessage(null)}
    >
      <div>
        <label className={labelClass}>Câu hỏi *</label>
        <input className={inputClass} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required />
      </div>
      <div>
        <label className={labelClass}>Câu trả lời</label>
        <RichTextEditor value={form.answer} onChange={(answer) => setForm({ ...form, answer })} />
      </div>
      <div>
        <label className={labelClass}>Dịch vụ liên quan</label>
        <select className={inputClass} value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })}>
          <option value="">— Không chọn —</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Thứ tự</label>
          <input type="number" className={inputClass} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded border-gray-300" />
            Xuất bản
          </label>
        </div>
      </div>
    </AdminFormShell>
  );
}
