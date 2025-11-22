import Image from 'next/image';
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
import {Checkbox} from '@/components/ui/checkbox';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {MoreHorizontal} from 'lucide-react';
import type {Application} from '@/lib/types';
import {badgeVariants} from '../ui/badge';

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
}: {
  applications: Application[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40px]">
            <Checkbox />
          </TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Date Applied</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[50px]">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map(app => (
          <TableRow key={app.id}>
            <TableCell>
              <Checkbox />
            </TableCell>
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                {app.companyLogo && (
                  <Image
                    src={app.companyLogo}
                    alt={`${app.company} logo`}
                    width={40}
                    height={40}
                    className="rounded-full"
                    data-ai-hint="company logo"
                  />
                )}
                <span className="truncate">{app.company}</span>
              </div>
            </TableCell>
            <TableCell className="truncate">{app.position}</TableCell>
            <TableCell>{app.dateApplied}</TableCell>
            <TableCell>
              <Badge variant={statusVariantMap[app.status]} className="capitalize">
                {app.status}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
