'use client';

import * as React from 'react';
import {MoreHorizontal, PlusCircle, Search, Upload, Mail, List, LayoutGrid} from 'lucide-react';
import type {Application, ApplicationStatus} from '../../lib/types';
import {Button} from '../ui/button';
import {Input} from '../ui/input';
import {Tabs, TabsList, TabsTrigger} from '../ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {ApplicationCards} from './ApplicationCards';
import {AddApplicationDialog} from './AddApplicationDialog';
import {DeleteApplicationDialog} from './DeleteApplicationDialog';
import {ImportApplicationsDialog} from './ImportApplicationsDialog';
import {useFirebase, deleteDocumentNonBlocking} from '../../firebase';
import {doc} from 'firebase/firestore';
import {useToast} from '../../hooks/use-toast';
import { EditApplicationDialog } from './EditApplicationDialog';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { useRouter } from 'next/navigation';
import { ApplicationTable } from './ApplicationTable';

const statusTabs: {value: ApplicationStatus | 'all'; label: string}[] = [
  {value: 'all', label: 'All'},
  {value: 'applied', label: 'Applied'},
  {value: 'interview', label: 'Interview'},
  {value: 'offer', label: 'Offer'},
  {value: 'rejected', label: 'Rejected'},
];

const DEMO_USER_ID = "mbjXKwJmpuNOCqW5CBBNi2Ppu1P2";

export default function ApplicationsClient({
  applications,
  activeTab,
  setActiveTab,
}: {
  applications: Application[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [applicationToEdit, setApplicationToEdit] = React.useState<Application | null>(null);
  const [applicationToDelete, setApplicationToDelete] =
    React.useState<Application | null>(null);
  const [view, setView] = React.useState<'card' | 'table'>('card');


  const {firestore, user} = useFirebase();
  const {toast} = useToast();
  const router = useRouter();
  
  React.useEffect(() => {
    // This allows the parent component (DashboardPage) to control the active tab
    // when a stat card is clicked.
    if (activeTab !== (document.querySelector('[data-state="active"]') as HTMLElement)?.dataset.value) {
       const trigger = document.querySelector(`[data-value="${activeTab}"]`) as HTMLElement;
       trigger?.click();
    }
  }, [activeTab]);


  const filteredApps = React.useMemo(() => {
    return applications
      .filter(app => (activeTab === 'all' ? true : app.status === activeTab))
      .filter(
        app =>
          app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [applications, activeTab, searchTerm]);

  const showDemoRestrictionToast = () => {
    toast({
      title: 'Demo Account Restriction',
      description: 'Editing or deleting sample applications is disabled in demo mode.',
      variant: 'default',
    });
  }

  const handleDeleteClick = (application: Application) => {
    if (user?.uid === DEMO_USER_ID) {
      showDemoRestrictionToast();
      return;
    }
    setApplicationToDelete(application);
    setIsDeleteDialogOpen(true);
  };
  
  const handleEditClick = (application: Application) => {
    if (user?.uid === DEMO_USER_ID) {
      showDemoRestrictionToast();
      return;
    }
    setApplicationToEdit(application);
    setIsEditDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!firestore || !user || !applicationToDelete) return;
     if (user.uid === DEMO_USER_ID) {
      showDemoRestrictionToast();
      setIsDeleteDialogOpen(false);
      return;
    }

    const docRef = doc(
      firestore,
      'users',
      user.uid,
      'applications',
      applicationToDelete.id
    );
    deleteDocumentNonBlocking(docRef);

    toast({
      title: 'Application Deleted',
      description: `The application for ${applicationToDelete.position} at ${applicationToDelete.companyName} has been deleted.`,
    });

    setIsDeleteDialogOpen(false);
    setApplicationToDelete(null);
  };
  
  const handleImportComplete = () => {
    toast({
      title: 'Import Successful',
      description: 'Your job applications have been imported.',
    });
  }

  return (
    <>
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Tabs
          value={activeTab}
          onValueChange={value => setActiveTab(value as any)}
          className="w-full sm:w-auto"
        >
          <ScrollArea className="w-full sm:w-auto">
            <TabsList>
              {statusTabs.map(tab => (
                <TabsTrigger key={tab.value} data-value={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Tabs>
        
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
           <div className="hidden items-center gap-2 md:flex">
             <Button
                variant={view === 'table' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setView('table')}
              >
                <List className="h-4 w-4" />
             </Button>
             <Button
                variant={view === 'card' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setView('card')}
              >
                <LayoutGrid className="h-4 w-4" />
             </Button>
          </div>
          <Button
            className="hidden sm:inline-flex"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Application</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Application
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsImportDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Import from CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/import-email')}>
                <Mail className="mr-2 h-4 w-4" />
                Import from Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mt-4">
        <div className="md:hidden">
            <ApplicationCards
            applications={filteredApps}
            onDelete={handleDeleteClick}
            onEdit={handleEditClick}
            onAdd={() => setIsAddDialogOpen(true)}
            />
        </div>
        <div className="hidden md:block">
            {view === 'card' ? (
                <ApplicationCards
                applications={filteredApps}
                onDelete={handleDeleteClick}
                onEdit={handleEditClick}
                onAdd={() => setIsAddDialogOpen(true)}
                />
            ) : (
                <ApplicationTable
                applications={filteredApps}
                onDelete={handleDeleteClick}
                onEdit={handleEditClick}
                />
            )}
        </div>
      </div>
       {/* FAB for mobile */}
       <Button
        className="fixed bottom-24 right-4 z-40 flex h-14 w-14 rounded-full shadow-lg sm:hidden"
        size="icon"
        onClick={() => setIsAddDialogOpen(true)}
      >
        <PlusCircle className="h-6 w-6" />
        <span className="sr-only">Add Application</span>
      </Button>

      <AddApplicationDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
       <ImportApplicationsDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onImportComplete={handleImportComplete}
      />
      <DeleteApplicationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDemoUser={user?.uid === DEMO_USER_ID}
      />
      {applicationToEdit && (
        <EditApplicationDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          application={applicationToEdit}
        />
      )}
    </div>
    </>
  );
}
