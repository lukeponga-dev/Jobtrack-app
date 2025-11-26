import { TrendingUp } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
      <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
        <TrendingUp size={20} />
      </div>
      <span className="font-headline">JobTrack</span>
    </div>
  );
}
