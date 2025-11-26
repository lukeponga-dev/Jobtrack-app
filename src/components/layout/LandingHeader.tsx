import Link from 'next/link';
import { Logo } from '../Logo';
import { Button } from '../ui/button';

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
