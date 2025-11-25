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
        <AppSidebar />
        <SidebarInset>
            <AppHeader />
            <main className="flex-1 bg-background p-4 pb-20 sm:p-6 lg:p-8">
              {children}
            </main>
        </SidebarInset>
        <BottomNavbar />
      </div>
    </SidebarProvider>
  );
}
