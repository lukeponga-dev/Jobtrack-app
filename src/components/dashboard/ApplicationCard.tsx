import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {MoreVertical} from 'lucide-react';
import type {Application} from '@/lib/types';
import { format } from 'date-fns';

const statusVariantMap: Record<
  Application['status'],
  React.ComponentProps<typeof Badge>['variant']
> = {
  applied: 'default',
  interview: 'secondary',
  offer: 'accent',
  rejected: 'destructive',
};

export function ApplicationCard({application}: {application: Application}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {application.companyLogo && (
            <Image
              src={application.companyLogo}
              alt={`${application.companyName} logo`}
              width={40}
              height={40}
              className="rounded-lg"
              data-ai-hint="company logo"
            />
          )}
          <div className="grid gap-1">
            <CardTitle className="truncate text-lg">{application.companyName}</CardTitle>
            <CardDescription className="truncate">
              {application.position}
            </CardDescription>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="-my-2 -mr-2">
              <MoreVertical className="h-4 w-4" />
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
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Badge variant={statusVariantMap[application.status]} className="capitalize">
          {application.status}
        </Badge>
        <div className="text-sm text-muted-foreground">
          {format(new Date(application.applicationDate), 'PPP')}
        </div>
      </CardFooter>
    </Card>
  );
}
