'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '../ui/chart';
import type { Application } from '@/lib/types';

const chartConfig = {
  applied: {
    label: 'Applied',
    color: 'hsl(var(--chart-2))',
  },
  interview: {
    label: 'Interview',
    color: 'hsl(var(--chart-1))',
  },
  offer: {
    label: 'Offer',
    color: 'hsl(var(--chart-3))',
  },
  rejected: {
    label: 'Rejected',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export function ApplicationStatusChart({ applications }: { applications: Application[] }) {
  const chartData = React.useMemo(() => {
    const statusCounts = {
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    };
    applications.forEach(app => {
      if (app.status in statusCounts) {
        statusCounts[app.status]++;
      }
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      fill: `var(--color-${status})`,
    }));
  }, [applications]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Pipeline</CardTitle>
        <CardDescription>A visual breakdown of your job search stages.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 20,
                left: -10,
                bottom: 5,
              }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="status"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, textTransform: 'capitalize' }}
                />
              <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
              <Bar dataKey="count" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
