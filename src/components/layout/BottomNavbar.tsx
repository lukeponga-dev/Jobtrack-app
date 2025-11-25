'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardPen, FileText, LayoutGrid, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useFirebase } from '@/firebase';

const menuItems = [
    {href: '/dashboard', label: 'Dashboard', icon: LayoutGrid},
    {href: '/resume-feedback', label: 'Resume', icon: FileText},
    {href: '/cover-letter-generator', label: 'Cover Letter', icon: ClipboardPen},
    {href: '/profile', label: 'Profile', icon: User},
];

export default function BottomNavbar() {
    const pathname = usePathname();
    const { user, isUserLoading } = useFirebase();

    if (isUserLoading || !user) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/80 backdrop-blur-md md:hidden">
            <div className="grid h-16 grid-cols-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                                isActive && 'text-primary'
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
