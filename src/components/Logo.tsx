export function Logo() {
  return (
    <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path
          d="M6.636 8.036H12.25V18.636C12.25 19.5273 11.5113 20.266 10.62 20.266C9.72875 20.266 8.99 19.5273 8.99 18.636V16.276"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.75 8.036H21.364V12.956C21.364 14.475 20.1512 15.688 18.632 15.688H15.75V8.036Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span className="font-headline">JobTrack</span>
    </div>
  );
}
