import AdminNav from "@/components/admin/AdminNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface md:flex">
      <AdminNav />
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
