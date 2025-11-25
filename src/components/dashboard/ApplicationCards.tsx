import {ApplicationCard} from './ApplicationCard';
import type {Application} from '@/lib/types';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';

export function ApplicationCards({
  applications,
  onDelete,
  onEdit,
  onAdd,
}: {
  applications: Application[];
  onDelete: (application: Application) => void;
  onEdit: (application: Application) => void;
  onAdd: () => void;
}) {
  if (applications.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold">No Applications Found</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Click the button below to add your first application.
        </p>
        <Button onClick={onAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {applications.map(app => (
        <ApplicationCard
          key={app.id}
          application={app}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
