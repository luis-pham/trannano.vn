"use client";

import { useState } from "react";
import { inputClass, labelClass } from "./AdminFormShell";

export type SeoValue = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
};

type SeoFieldsProps = {
  value: SeoValue;
  onChange: (value: SeoValue) => void;
};

export default function SeoFields({ value, onChange }: SeoFieldsProps) {
  const [open, setOpen] = useState(false);
  const descLen = (value.metaDescription || "").length;
  const descWarn = descLen > 160;

  return (
    <div className="rounded-lg border border-gray-200">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
      >
        <span>SEO</span>
        <span className="text-gray-400">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="space-y-4 border-t border-gray-200 px-4 py-4">
          <div>
            <label className={labelClass}>Meta title</label>
            <input
              type="text"
              className={inputClass}
              value={value.metaTitle || ""}
              onChange={(e) => onChange({ ...value, metaTitle: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Meta description</label>
            <textarea
              className={inputClass}
              rows={3}
              value={value.metaDescription || ""}
              onChange={(e) => onChange({ ...value, metaDescription: e.target.value })}
            />
            <p className={`mt-1 text-xs ${descWarn ? "text-amber-600" : "text-gray-500"}`}>
              {descLen} ký tự{descWarn ? " — nên dưới 160 ký tự" : ""}
            </p>
          </div>
          <div>
            <label className={labelClass}>OG image (URL)</label>
            <input
              type="url"
              className={inputClass}
              value={value.ogImage || ""}
              onChange={(e) => onChange({ ...value, ogImage: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>
      )}
    </div>
  );
}
