import {ApplicationCard} from './ApplicationCard';
import type {Application} from '@/lib/types';
import { Button } from '../ui/button';

export function ApplicationCards({
  applications,
  onDelete,
  onEdit,
}: {
  applications: Application[];
  onDelete: (application: Application) => void;
  onEdit: (application: Application) => void;
}) {
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center h-64">
        <h3 className="text-lg font-semibold">No Applications Found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Click the button below to add your first application.
        </p>
        <Button>Add Application</Button>
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
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
