'use client';

import * as React from 'react';
import {MoreHorizontal, PlusCircle, Search} from 'lucide-react';
import {useIsMobile} from '@/hooks/use-mobile';
import type {Application, ApplicationStatus} from '@/lib/types';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {ApplicationTable} from './ApplicationTable';
import {ApplicationCards} from './ApplicationCards';
import {AddApplicationDialog} from './AddApplicationDialog';

const statusTabs: {value: ApplicationStatus | 'all'; label: string}[] = [
  {value: 'all', label: 'All'},
  {value: 'applied', label: 'Applied'},
  {value: 'interview', label: 'Interview'},
  {value: 'offer', label: 'Offer'},
  {value: 'rejected', label: 'Rejected'},
];

export default function ApplicationsClient({
  applications,
}: {
  applications: Application[];
}) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = React.useState<ApplicationStatus | 'all'>(
    'all'
  );
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const filteredApps = React.useMemo(() => {
    return applications
      .filter(app => (activeTab === 'all' ? true : app.status === activeTab))
      .filter(
        app =>
          app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [applications, activeTab, searchTerm]);

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={value => setActiveTab(value as any)}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <TabsList>
            {statusTabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex w-full items-center gap-2 sm:ml-auto sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              className="hidden sm:inline-flex"
              onClick={() => setIsDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Application
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="sm:hidden">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Application
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {statusTabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4">
            {isMobile ? (
              <ApplicationCards applications={filteredApps} />
            ) : (
              <ApplicationTable applications={filteredApps} />
            )}
          </TabsContent>
        ))}
      </Tabs>
      <AddApplicationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
