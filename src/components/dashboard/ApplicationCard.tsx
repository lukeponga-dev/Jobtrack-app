import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {Button} from '../ui/button';
import {Badge} from '../ui/badge';
import {Building, MoreVertical} from 'lucide-react';
import type {Application} from '../../lib/types';
import {format} from 'date-fns';

const statusVariantMap: Record<
  Application['status'],
  React.ComponentProps<typeof Badge>['variant']
> = {
  applied: 'default',
  interview: 'secondary',
  offer: 'accent',
  rejected: 'destructive',
};

export function ApplicationCard({
  application,
  onDelete,
  onEdit,
}: {
  application: Application;
  onDelete: (application: Application) => void;
  onEdit: (application: Application) => void;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {application.companyLogoUrl ? (
            <Image
              src={application.companyLogoUrl}
              alt={`${application.companyName} logo`}
              width={40}
              height={40}
              className="rounded-lg border"
              data-ai-hint="company logo"
            />
          ): (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted">
              <Building className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div className="grid gap-1">
            <CardTitle className="truncate text-lg">
              {application.companyName}
            </CardTitle>
            <CardDescription className="truncate">
              {application.position}
            </CardDescription>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="-my-2 -mr-2 flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/application/${application.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(application)}>Edit</DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(application)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardFooter className="mt-auto flex justify-between">
        <Badge
          variant={statusVariantMap[application.status]}
          className="capitalize"
        >
          {application.status}
        </Badge>
        <div className="text-sm text-muted-foreground">
          {format(new Date(application.applicationDate), 'PPP')}
        </div>
      </CardFooter>
    </Card>
  );
}
