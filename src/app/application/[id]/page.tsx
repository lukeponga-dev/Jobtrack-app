import DashboardLayout from '@/app/dashboard/layout';
import ApplicationDetailClient from './ApplicationDetailClient';

export default function ApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <DashboardLayout>
      <ApplicationDetailClient applicationId={params.id} />
    </DashboardLayout>
  );
}
