"use client";

import { useEffect, useState } from "react";
import AdminFormShell, { inputClass, labelClass } from "./AdminFormShell";
import RichTextEditor from "./RichTextEditor";
import SeoFields, { type SeoValue } from "./SeoFields";

type PageFormData = {
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
};

const empty: PageFormData = {
  title: "",
  slug: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
  ogImage: "",
};

export default function PageForm({ id }: { id: string }) {
  const [form, setForm] = useState<PageFormData>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch(`/api/admin/pages/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setMessage({ type: "error", text: data.error });
          return;
        }
        setForm({
          title: data.title || "",
          slug: data.slug || "",
          content: data.content || "",
          metaTitle: data.metaTitle || "",
          metaDescription: data.metaDescription || "",
          ogImage: data.ogImage || "",
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await fetch(`/api/admin/pages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        content: form.content,
        metaTitle: form.metaTitle || null,
        metaDescription: form.metaDescription || null,
        ogImage: form.ogImage || null,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage({ type: "error", text: data.error || "Lỗi lưu dữ liệu" });
    } else {
      setMessage({ type: "success", text: "Đã lưu" });
    }
    setSaving(false);
  }

  const seo: SeoValue = {
    metaTitle: form.metaTitle,
    metaDescription: form.metaDescription,
    ogImage: form.ogImage,
  };

  if (loading) return <p className="text-sm text-gray-500">Đang tải...</p>;

  return (
    <AdminFormShell
      title={`Sửa trang: ${form.title}`}
      onSubmit={handleSubmit}
      saving={saving}
      message={message}
      onDismissMessage={() => setMessage(null)}
    >
      <div>
        <label className={labelClass}>Slug</label>
        <input className={`${inputClass} bg-gray-50`} value={form.slug} readOnly disabled />
      </div>
      <div>
        <label className={labelClass}>Tiêu đề *</label>
        <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      </div>
      <div>
        <label className={labelClass}>Nội dung</label>
        <RichTextEditor value={form.content} onChange={(content) => setForm({ ...form, content })} />
      </div>
      <SeoFields
        value={seo}
        onChange={(v) =>
          setForm({ ...form, metaTitle: v.metaTitle || "", metaDescription: v.metaDescription || "", ogImage: v.ogImage || "" })
        }
      />
    </AdminFormShell>
  );
}
