import Sidebar from "@/components/Sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 md:ml-64 relative bg-slate-50/50 min-h-screen">
        <Header />
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}