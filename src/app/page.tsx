'use client';
import React from 'react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import ApplicationsClient from '@/components/dashboard/ApplicationsClient';
import { useCollection, useFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Application } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { firestore, user, isUserLoading } = useFirebase();

  const applicationsCollectionRef = React.useMemo(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'applications');
  }, [firestore, user]);

  const { data: applications, isLoading } = useCollection<Application>(applicationsCollectionRef as any);

  if (isUserLoading || isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <header className="space-y-1">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </header>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const allApplications = applications || [];

  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Here's an overview of your job application journey.
        </p>
      </header>
      <DashboardStats applications={allApplications} />
      <ApplicationsClient applications={allApplications} />
    </div>
  );
}
