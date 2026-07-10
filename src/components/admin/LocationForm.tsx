"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminFormShell, { inputClass, labelClass } from "./AdminFormShell";
import RichTextEditor from "./RichTextEditor";
import ImageUploader from "./ImageUploader";
import SeoFields, { type SeoValue } from "./SeoFields";

type LocationFormData = {
  title: string;
  slug: string;
  content: string;
  images: string[];
  order: number;
  published: boolean;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
};

const empty: LocationFormData = {
  title: "",
  slug: "",
  content: "",
  images: [],
  order: 0,
  published: false,
  metaTitle: "",
  metaDescription: "",
  ogImage: "",
};

export default function LocationForm({ id }: { id?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<LocationFormData>(empty);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/locations/${id}`)
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
          images: data.images || [],
          order: data.order ?? 0,
          published: Boolean(data.published),
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

    const url = id ? `/api/admin/locations/${id}` : "/api/admin/locations";
    const res = await fetch(url, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        slug: form.slug || undefined,
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
      if (!id) router.push(`/admin/locations/${data.id}`);
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
      title={id ? "Sửa khu vực" : "Thêm khu vực"}
      onSubmit={handleSubmit}
      saving={saving}
      message={message}
      onDismissMessage={() => setMessage(null)}
    >
      <div>
        <label className={labelClass}>Tiêu đề *</label>
        <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      </div>
      <div>
        <label className={labelClass}>Slug (tùy chọn)</label>
        <input className={inputClass} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
      </div>
      <div>
        <label className={labelClass}>Nội dung</label>
        <RichTextEditor value={form.content} onChange={(content) => setForm({ ...form, content })} />
      </div>
      <div>
        <label className={labelClass}>Hình ảnh</label>
        <ImageUploader images={form.images} onChange={(images) => setForm({ ...form, images })} />
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
      <SeoFields
        value={seo}
        onChange={(v) =>
          setForm({ ...form, metaTitle: v.metaTitle || "", metaDescription: v.metaDescription || "", ogImage: v.ogImage || "" })
        }
      />
    </AdminFormShell>
  );
}
