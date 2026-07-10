"use client";

import Toast from "./Toast";

type Message = { type: "success" | "error"; text: string } | null;

type AdminFormShellProps = {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  saving?: boolean;
  message?: Message;
  onDismissMessage?: () => void;
};

export const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

export const labelClass = "mb-1 block text-sm font-medium text-gray-700";

export default function AdminFormShell({
  title,
  children,
  onSubmit,
  saving = false,
  message,
  onDismissMessage,
}: AdminFormShellProps) {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-900">{title}</h1>
      {message && (
        <Toast type={message.type} text={message.text} className="mb-4" onDismiss={onDismissMessage} />
      )}
      <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
        {children}
        <div className="sticky bottom-0 -mx-4 mt-8 border-t border-gray-200 bg-white/95 px-4 py-4 md:-mx-6 md:px-6">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
}
