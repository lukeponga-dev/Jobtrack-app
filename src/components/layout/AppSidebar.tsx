'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {ClipboardPen, FileText, LayoutGrid, User} from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '../ui/sidebar';
import {Logo} from '../Logo';

const menuItems = [
  {href: '/dashboard', label: 'Dashboard', icon: LayoutGrid},
  {href: '/resume-feedback', label: 'Resume Feedback', icon: FileText},
  {
    href: '/cover-letter-generator',
    label: 'Cover Letter AI',
    icon: ClipboardPen,
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: User,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="hidden md:flex">
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map(item => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
