'use client';
import React from 'react';
import { DashboardStats } from '../../components/dashboard/DashboardStats';
import ApplicationsClient from '../../components/dashboard/ApplicationsClient';
import { useCollection, useFirebase } from '../../firebase';
import { collection } from 'firebase/firestore';
import { Application } from '../../lib/types';
import { Skeleton } from '../../components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { firestore, user, isUserLoading } = useFirebase();

  const applicationsCollectionRef = React.useMemo(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'applications');
  }, [firestore, user]);

  const { data: applications, isLoading: areApplicationsLoading } = useCollection<Application>(applicationsCollectionRef as any);

  const isLoading = isUserLoading || areApplicationsLoading;
  
  if (isLoading || !user) {
    return (
       <div className="flex h-screen items-center justify-center">
         <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
