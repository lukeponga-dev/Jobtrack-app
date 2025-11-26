
export function Logo() {
  return (
    <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
      <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.2,20.4H4.8V9.8C4.8,8,6.2,6.6,8,6.6H12.2V9.9H8.2V20.4z"
            fill="currentColor"
          />
          <path
            d="M19.2,9.9h-4V6.6h5.8c-0.2-2.9-2.5-5.1-5.4-5.1c-3,0-5.4,2.4-5.4,5.4v0.2h3.4v-0.2c0-1.1,0.9-2,2-2s2,0.9,2,2v0h-3.8c-1.8,0-3.2,1.4-3.2,3.2v7.3h10.8V9.9z"
            fill="currentColor"
          />
        </svg>
      </div>
      <span className="font-headline">JobTrack</span>
    </div>
  );
}
