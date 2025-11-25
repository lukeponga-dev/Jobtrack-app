import {ApplicationCard} from './ApplicationCard';
import type {Application} from '@/lib/types';

export function ApplicationCards({
  applications,
  onDelete,
}: {
  applications: Application[];
  onDelete: (application: Application) => void;
}) {
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold">No Applications Found</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or filters.
        </p>
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
        />
      ))}
    </div>
  );
}
