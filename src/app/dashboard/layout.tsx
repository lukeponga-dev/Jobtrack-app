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
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="min-h-[calc(100vh-4rem)] bg-background p-2 pb-20 sm:p-4 lg:p-6">
          {children}
        </main>
        <BottomNavbar />
      </SidebarInset>
    </SidebarProvider>
  );
}
