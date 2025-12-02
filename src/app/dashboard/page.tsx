'use client';
import React from 'react';
import { DashboardStats } from '../../components/dashboard/DashboardStats';
import ApplicationsClient from '../../components/dashboard/ApplicationsClient';
import { useCollection, useFirebase } from '../../firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Application } from '../../lib/types';
import { Skeleton } from '../../components/ui/skeleton';
import { ApplicationStatusChart } from '@/components/dashboard/ApplicationStatusChart';

const DashboardSkeletons = () => (
  <>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
    </div>
    <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
        </div>
    </div>
  </>
)

const ChartSkeleton = () => (
    <Skeleton className="h-[350px] w-full" />
)


export default function DashboardPage() {
  const { firestore, user, isUserLoading } = useFirebase();
  const [activeTab, setActiveTab] = React.useState('all');

  const applicationsQuery = React.useMemo(() => {
    if (!firestore || !user) return null;
    const collRef = collection(firestore, 'users', user.uid, 'applications');
    return query(collRef, orderBy('applicationDate', 'desc'));
  }, [firestore, user]);

  const { data: applications, isLoading: areApplicationsLoading } = useCollection<Application>(applicationsQuery);

  const isLoading = isUserLoading || areApplicationsLoading;

  const allApplications = applications || [];

  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Here's an overview of your job application journey.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
            {isLoading ? (
                <DashboardSkeletons />
            ) : (
                <>
                    <DashboardStats applications={allApplications} onStatClick={(status) => setActiveTab(status)} />
                    <ApplicationsClient applications={allApplications} activeTab={activeTab} setActiveTab={setActiveTab} />
                </>
            )}
        </div>
        <div className="lg:col-span-1">
            {isLoading ? (
                <ChartSkeleton />
            ) : (
                <ApplicationStatusChart applications={allApplications} />
            )}
        </div>
      </div>
    </div>
  );
}
