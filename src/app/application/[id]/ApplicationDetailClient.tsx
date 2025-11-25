
'use client';

import React from 'react';
import { useFirebase, useDoc } from '../../../firebase';
import { doc } from 'firebase/firestore';
import { Application } from '../../../lib/types';
import { Skeleton } from '../../../components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import {
  Calendar,
  Building,
  Link as LinkIcon,
  FileText,
  Paperclip,
  ArrowLeft,
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../../../components/ui/button';
import Link from 'next/link';
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

export default function ApplicationDetailClient({
  applicationId,
}: {
  applicationId: string;
}) {
  const { firestore, user, isUserLoading } = useFirebase();

  const applicationDocRef = React.useMemo(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid, 'applications', applicationId);
  }, [firestore, user, applicationId]);

  const { data: application, isLoading } = useDoc<Application>(
    applicationDocRef
  );

  if (isLoading || isUserLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-6 md:col-span-1">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center">
        <p className="mb-4">Application not found.</p>
        <Button asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6">
      <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/dashboard">
              <ArrowLeft />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {application.position}
            </h1>
            <p className="text-lg text-muted-foreground">
              at {application.companyName}
            </p>
          </div>
        </div>
        <Badge
          variant={statusVariantMap[application.status]}
          className="capitalize"
        >
          {application.status}
        </Badge>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <main className="col-span-1 space-y-6 md:col-span-2">
          {application.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText /> Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {application.notes}
                </div>
              </CardContent>
            </Card>
          )}

          {application.attachments && application.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip /> Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {application.attachments.map((att: any) => (
                    <li
                      key={att.id}
                      className="flex items-center justify-between rounded-md border p-2"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">{att.name}</span>
                        <Badge variant="outline" className="text-xs">{att.type}</Badge>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={att.url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </main>

        <aside className="col-span-1 space-y-6 md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                {application.companyLogoUrl ? (
                   <Image
                      src={application.companyLogoUrl}
                      alt={`${application.companyName} logo`}
                      width={48}
                      height={48}
                      className="rounded-lg border"
                      data-ai-hint="company logo"
                    />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-muted">
                    <Building className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <p className="font-semibold">{application.companyName}</p>
                  <p className="text-sm text-muted-foreground">{application.position}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Date Applied</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(application.applicationDate), 'PPP')}
                  </p>
                </div>
              </div>
              {application.jobUrl && (
                 <div className="flex items-center gap-3">
                    <LinkIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Job Posting</p>
                       <a href={application.jobUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline-offset-4 hover:underline">
                          View original listing
                       </a>
                    </div>
                 </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
