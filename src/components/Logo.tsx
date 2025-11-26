import {FolderKanban} from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
      <FolderKanban className="h-6 w-6 text-primary" />
      <span className="font-headline">JobTrack</span>
    </div>
  );
}
