"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminFormShell, { inputClass, labelClass } from "./AdminFormShell";
import RichTextEditor from "./RichTextEditor";
import ImageUploader from "./ImageUploader";
import SeoFields, { type SeoValue } from "./SeoFields";

type LocationOption = { id: string; title: string };

type ProjectFormData = {
  title: string;
  slug: string;
  content: string;
  images: string[];
  projectDate: string;
  locationId: string;
  published: boolean;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
};

const empty: ProjectFormData = {
  title: "",
  slug: "",
  content: "",
  images: [],
  projectDate: "",
  locationId: "",
  published: false,
  metaTitle: "",
  metaDescription: "",
  ogImage: "",
};

export default function ProjectForm({ id }: { id?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectFormData>(empty);
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/locations")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLocations(data.map((l: LocationOption) => ({ id: l.id, title: l.title })));
        }
      });
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/projects/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setMessage({ type: "error", text: data.error });
          return;
        }
        const date = data.projectDate ? String(data.projectDate).slice(0, 10) : "";
        setForm({
          title: data.title || "",
          slug: data.slug || "",
          content: data.content || "",
          images: data.images || [],
          projectDate: date,
          locationId: data.locationId || "",
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

    const url = id ? `/api/admin/projects/${id}` : "/api/admin/projects";
    const res = await fetch(url, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        slug: form.slug || undefined,
        projectDate: form.projectDate || null,
        locationId: form.locationId || null,
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
      if (!id) router.push(`/admin/projects/${data.id}`);
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
      title={id ? "Sửa dự án" : "Thêm dự án"}
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
          <label className={labelClass}>Ngày dự án</label>
          <input type="date" className={inputClass} value={form.projectDate} onChange={(e) => setForm({ ...form, projectDate: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Khu vực</label>
          <select className={inputClass} value={form.locationId} onChange={(e) => setForm({ ...form, locationId: e.target.value })}>
            <option value="">— Không chọn —</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded border-gray-300" />
          Xuất bản
        </label>
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
