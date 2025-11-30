
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, MoreVertical } from 'lucide-react';
import type { Application } from '@/lib/types';
import { format } from 'date-fns';
import Image from 'next/image';

const statusVariantMap: Record<
  Application['status'],
  React.ComponentProps<typeof Badge>['variant']
> = {
  applied: 'default',
  interview: 'secondary',
  offer: 'accent',
  rejected: 'destructive',
};

export function ApplicationTable({
  applications,
  onDelete,
  onEdit,
}: {
  applications: Application[];
  onDelete: (application: Application) => void;
  onEdit: (application: Application) => void;
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Date Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No applications found.
              </TableCell>
            </TableRow>
          ) : (
            applications.map(app => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    {app.companyLogoUrl ? (
                      <Image
                        src={app.companyLogoUrl}
                        alt={`${app.companyName} logo`}
                        width={24}
                        height={24}
                        className="rounded-md border"
                        data-ai-hint="company logo"
                      />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-md border bg-muted">
                        <Building className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    {app.companyName}
                  </div>
                </TableCell>
                <TableCell>{app.position}</TableCell>
                <TableCell>
                  {format(new Date(app.applicationDate), 'PP')}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={statusVariantMap[app.status]}
                    className="capitalize"
                  >
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        aria-haspopup="true"
                        size="icon"
                        variant="ghost"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                         <Link href={`/application/${app.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(app)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(app)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
