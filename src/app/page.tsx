import {DashboardStats} from '@/components/dashboard/DashboardStats';
import {applications} from '@/lib/data';
import ApplicationsClient from '@/components/dashboard/ApplicationsClient';

export default function DashboardPage() {
  const allApplications = applications;

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
