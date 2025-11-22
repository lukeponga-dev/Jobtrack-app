import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {Briefcase, FileCheck, FileClock, Trophy, XCircle} from 'lucide-react';
import type {Application, ApplicationStatus} from '@/lib/types';

export function DashboardStats({applications}: {applications: Application[]}) {
  const getCount = (status?: ApplicationStatus) => {
    if (!status) return applications.length;
    return applications.filter(a => a.status === status).length;
  };

  const statItems = [
    {
      title: 'Total Applications',
      value: getCount(),
      icon: Briefcase,
      color: 'text-muted-foreground',
    },
    {
      title: 'Applied',
      value: getCount('applied'),
      icon: FileClock,
      color: 'text-primary',
    },
    {
      title: 'Interview',
      value: getCount('interview'),
      icon: FileCheck,
      color: 'text-secondary',
    },
    {
      title: 'Offer',
      value: getCount('offer'),
      icon: Trophy,
      color: 'text-accent',
    },
    {
      title: 'Rejected',
      value: getCount('rejected'),
      icon: XCircle,
      color: 'text-destructive',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {statItems.map(item => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
