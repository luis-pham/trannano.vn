"use client";

import { useEffect, useState } from "react";
import AdminFormShell, { inputClass, labelClass } from "./AdminFormShell";

type SettingsFormData = {
  businessName: string;
  phone: string;
  zaloUrl: string;
  address: string;
  workingHours: string;
  serviceAreas: string;
  mapEmbedUrl: string;
  facebookUrl: string;
  googleBusinessUrl: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  defaultOgImage: string;
};

const empty: SettingsFormData = {
  businessName: "",
  phone: "",
  zaloUrl: "",
  address: "",
  workingHours: "",
  serviceAreas: "",
  mapEmbedUrl: "",
  facebookUrl: "",
  googleBusinessUrl: "",
  defaultMetaTitle: "",
  defaultMetaDescription: "",
  defaultOgImage: "",
};

export default function SettingsForm() {
  const [form, setForm] = useState<SettingsFormData>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setMessage({ type: "error", text: data.error });
          return;
        }
        setForm({
          businessName: data.businessName || "",
          phone: data.phone || "",
          zaloUrl: data.zaloUrl || "",
          address: data.address || "",
          workingHours: data.workingHours || "",
          serviceAreas: data.serviceAreas || "",
          mapEmbedUrl: data.mapEmbedUrl || "",
          facebookUrl: data.facebookUrl || "",
          googleBusinessUrl: data.googleBusinessUrl || "",
          defaultMetaTitle: data.defaultMetaTitle || "",
          defaultMetaDescription: data.defaultMetaDescription || "",
          defaultOgImage: data.defaultOgImage || "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        zaloUrl: form.zaloUrl || null,
        address: form.address || null,
        mapEmbedUrl: form.mapEmbedUrl || null,
        facebookUrl: form.facebookUrl || null,
        googleBusinessUrl: form.googleBusinessUrl || null,
        defaultOgImage: form.defaultOgImage || null,
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

  if (loading) return <p className="text-sm text-gray-500">Đang tải...</p>;

  return (
    <AdminFormShell
      title="Cấu hình website"
      onSubmit={handleSubmit}
      saving={saving}
      message={message}
      onDismissMessage={() => setMessage(null)}
    >
      <fieldset className="space-y-4 rounded-lg border border-gray-200 p-4">
        <legend className="px-1 text-sm font-medium text-gray-700">Thông tin doanh nghiệp</legend>
        <div>
          <label className={labelClass}>Tên công ty *</label>
          <input className={inputClass} value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required />
          <p className="mt-1 text-xs text-gray-500">Logo hiển thị: Trannano.vn · Tagline: Chuyên Thi Công Trần Nano</p>
        </div>
        <div>
          <label className={labelClass}>Số điện thoại *</label>
          <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        </div>
        <div>
          <label className={labelClass}>Link Zalo</label>
          <input className={inputClass} value={form.zaloUrl} onChange={(e) => setForm({ ...form, zaloUrl: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Địa chỉ</label>
          <textarea className={inputClass} rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Thời gian liên hệ *</label>
          <input className={inputClass} value={form.workingHours} onChange={(e) => setForm({ ...form, workingHours: e.target.value })} required />
          <p className="mt-1 text-xs text-gray-500">Ví dụ: Nhận điện thoại 24/7</p>
        </div>
        <div>
          <label className={labelClass}>Khu vực phục vụ *</label>
          <input className={inputClass} value={form.serviceAreas} onChange={(e) => setForm({ ...form, serviceAreas: e.target.value })} required />
        </div>
        <div>
          <label className={labelClass}>Google Maps embed URL</label>
          <input className={inputClass} value={form.mapEmbedUrl} onChange={(e) => setForm({ ...form, mapEmbedUrl: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Facebook URL</label>
          <input className={inputClass} value={form.facebookUrl} onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Google Business URL</label>
          <input className={inputClass} value={form.googleBusinessUrl} onChange={(e) => setForm({ ...form, googleBusinessUrl: e.target.value })} />
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-lg border border-gray-200 p-4">
        <legend className="px-1 text-sm font-medium text-gray-700">SEO mặc định</legend>
        <div>
          <label className={labelClass}>Meta title mặc định *</label>
          <input className={inputClass} value={form.defaultMetaTitle} onChange={(e) => setForm({ ...form, defaultMetaTitle: e.target.value })} required />
        </div>
        <div>
          <label className={labelClass}>Meta description mặc định *</label>
          <textarea className={inputClass} rows={3} value={form.defaultMetaDescription} onChange={(e) => setForm({ ...form, defaultMetaDescription: e.target.value })} required />
        </div>
        <div>
          <label className={labelClass}>OG image mặc định (URL)</label>
          <input className={inputClass} value={form.defaultOgImage} onChange={(e) => setForm({ ...form, defaultOgImage: e.target.value })} />
        </div>
      </fieldset>
    </AdminFormShell>
  );
}
