"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Có lỗi khi tải trang</h1>
      <p className="mt-3 text-sm text-gray-600">
        Thường do kết nối database. Kiểm tra biến <code className="text-xs">DATABASE_URL</code> trên
        Vercel và đã chạy <code className="text-xs">prisma db push</code> + seed chưa.
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-gray-400">Digest: {error.digest}</p>
      )}
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
      >
        Thử lại
      </button>
    </div>
  );
}
