
import Link from 'next/link';
import { Logo } from '../Logo';

export default function LandingFooter() {
  return (
    <footer className="border-t bg-muted">
      <div className="container mx-auto flex h-16 flex-col items-center justify-between gap-4 px-4 py-4 text-sm text-muted-foreground sm:flex-row sm:py-0">
        <Logo />
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms of Service
          </Link>
        </div>
        <p>&copy; {new Date().getFullYear()} JobTrack. All rights reserved.</p>
      </div>
    </footer>
  );
}
