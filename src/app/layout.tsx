import type {Metadata} from 'next';
import './globals.css';
import {SidebarProvider, SidebarInset} from '../components/ui/sidebar';
import AppSidebar from '../components/layout/AppSidebar';
import AppHeader from '../components/layout/AppHeader';
import {Toaster} from '../components/ui/toaster';
import { FirebaseClientProvider } from '../firebase';
import { ThemeProvider } from '../components/ThemeProvider';
import BottomNavbar from '../components/layout/BottomNavbar';

export const metadata: Metadata = {
  title: 'JobTrack App',
  description: 'Track your job applications with ease.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
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
          </FirebaseClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
