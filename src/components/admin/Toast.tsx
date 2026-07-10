"use client";

type ToastProps = {
  type: "success" | "error";
  text: string;
  className?: string;
  onDismiss?: () => void;
};

export default function Toast({ type, text, className = "", onDismiss }: ToastProps) {
  const styles =
    type === "success"
      ? "border-green-200 bg-green-50 text-green-800"
      : "border-red-200 bg-red-50 text-red-800";

  return (
    <div className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${styles} ${className}`} role="alert">
      <span>{text}</span>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="shrink-0 opacity-70 hover:opacity-100" aria-label="Đóng">
          ×
        </button>
      )}
    </div>
  );
}
