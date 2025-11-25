'use client';

import Link from 'next/link';
import {SidebarTrigger} from '../../components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {Button} from '../../components/ui/button';
import {Avatar, AvatarFallback, AvatarImage} from '../../components/ui/avatar';
import {LogOut, User, LogIn, Moon, Sun, Download} from 'lucide-react';
import { useFirebase } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Logo } from '../Logo';
import { useInstallPrompt } from '@/hooks/use-install-prompt';
import { InstallPwaDialog } from '../pwa/InstallPwaDialog';
import React from 'react';

function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default function AppHeader() {
  const { auth, user } = useFirebase();
  const router = useRouter();
  const { canInstall, showInstallPrompt } = useInstallPrompt();
  const [isInstallDialogOpen, setIsInstallDialogOpen] = React.useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const userAvatar = user?.photoURL;
  const userName = user?.displayName;
  const userInitials = userName
    ? userName
        .split(' ')
        .map(n => n[0])
        .join('')
    : 'U';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-md md:justify-end md:px-6">
      <div className="flex items-center gap-4 md:hidden">
        <SidebarTrigger />
        <span className="font-semibold">JobTrack</span>
      </div>
      <div className="flex items-center gap-2">
        {canInstall && (
          <>
            <Button variant="outline" size="sm" onClick={() => setIsInstallDialogOpen(true)}>
              <Download className="mr-2 h-4 w-4" />
              Install App
            </Button>
            <InstallPwaDialog
              isOpen={isInstallDialogOpen}
              onClose={() => setIsInstallDialogOpen(false)}
              onInstall={showInstallPrompt}
            />
          </>
        )}
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                {userAvatar && <AvatarImage src={userAvatar} alt="User Avatar" />}
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {user ? (
              <>
                <DropdownMenuLabel>{userName || 'My Account'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Log in</span>
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
