import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import BottomNavbar from "@/components/layout/BottomNavbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen flex-col">
        <AppHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <main className="flex-1 bg-background p-6 pb-20 sm:p-8">
            {children}
          </main>
        </div>
        <BottomNavbar />
      </div>
    </SidebarProvider>
  );
}
