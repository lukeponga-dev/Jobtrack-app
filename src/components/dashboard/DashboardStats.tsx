
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../ui/card';
import {Briefcase, FileCheck, FileClock, Trophy, XCircle} from 'lucide-react';
import type {Application, ApplicationStatus} from '../../lib/types';
import { Progress } from '../ui/progress';

export function DashboardStats({applications}: {applications: Application[]}) {
  const getCount = (status?: ApplicationStatus) => {
    if (!status) return applications.length;
    return applications.filter(a => a.status === status).length;
  };

  const totalApplications = getCount();
  const offerCount = getCount('offer');
  const successRate = totalApplications > 0 ? (offerCount / totalApplications) * 100 : 0;

  const statItems = [
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
      color: 'text-blue-500',
    },
    {
      title: 'Rejected',
      value: getCount('rejected'),
      icon: XCircle,
      color: 'text-destructive',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offers</CardTitle>
            <div className="rounded-lg bg-accent p-2">
              <Trophy className="h-4 w-4 text-accent-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offerCount}</div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(successRate)}%</div>
            <Progress value={successRate} className="mt-2 h-2" />
          </CardContent>
        </Card>
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
