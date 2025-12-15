
export function Logo() {
  return (
    <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
      <div className="bg-primary text-primary-foreground p-1.5 rounded-lg bg-gradient-to-br from-primary via-primary to-primary/80">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 3v18h18" />
          <path d="M7 17V7h10v10" />
          <path d="M12 12.5v-5.5" />
        </svg>
      </div>
      <span className="font-headline">JobTrack</span>
    </div>
  );
}
