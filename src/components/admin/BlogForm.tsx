"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminFormShell, { inputClass, labelClass } from "./AdminFormShell";
import RichTextEditor from "./RichTextEditor";
import ImageUploader from "./ImageUploader";
import SeoFields, { type SeoValue } from "./SeoFields";

type BlogFormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  published: boolean;
  publishedAt: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
};

const empty: BlogFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "",
  published: false,
  publishedAt: "",
  metaTitle: "",
  metaDescription: "",
  ogImage: "",
};

export default function BlogForm({ id }: { id?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<BlogFormData>(empty);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/blog/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setMessage({ type: "error", text: data.error });
          return;
        }
        const publishedAt = data.publishedAt ? String(data.publishedAt).slice(0, 10) : "";
        setForm({
          title: data.title || "",
          slug: data.slug || "",
          excerpt: data.excerpt || "",
          content: data.content || "",
          coverImage: data.coverImage || "",
          category: data.category || "",
          published: Boolean(data.published),
          publishedAt,
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

    const url = id ? `/api/admin/blog/${id}` : "/api/admin/blog";
    const res = await fetch(url, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        slug: form.slug || undefined,
        excerpt: form.excerpt || null,
        coverImage: form.coverImage || null,
        category: form.category || null,
        publishedAt: form.publishedAt || null,
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
      if (!id) router.push(`/admin/blog/${data.id}`);
    }
    setSaving(false);
  }

  const seo: SeoValue = {
    metaTitle: form.metaTitle,
    metaDescription: form.metaDescription,
    ogImage: form.ogImage,
  };

  const coverImages = form.coverImage ? [form.coverImage] : [];

  if (loading) return <p className="text-sm text-gray-500">Đang tải...</p>;

  return (
    <AdminFormShell
      title={id ? "Sửa bài viết" : "Thêm bài viết"}
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
        <label className={labelClass}>Tóm tắt</label>
        <textarea className={inputClass} rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
      </div>
      <div>
        <label className={labelClass}>Nội dung</label>
        <RichTextEditor value={form.content} onChange={(content) => setForm({ ...form, content })} />
      </div>
      <div>
        <label className={labelClass}>Ảnh bìa</label>
        <ImageUploader
          images={coverImages}
          max={1}
          onChange={(images) => setForm({ ...form, coverImage: images[0] || "" })}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Danh mục</label>
          <input className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Ngày xuất bản</label>
          <input type="date" className={inputClass} value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} />
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
