'use client';

import * as React from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Separator} from '@/components/ui/separator';

const GoogleIcon = () => (
  <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
    <path
      fill="currentColor"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.73 1.9-3.41 0-6.2-2.73-6.2-6.08s2.79-6.08 6.2-6.08c1.84 0 3.22.71 4.21 1.64l2.5-2.5c-1.59-1.47-3.68-2.34-6.71-2.34-5.52 0-10 4.48-10 10s4.48 10 10 10c5.73 0 9.5-3.87 9.5-9.66 0-.6-.07-1.18-.18-1.72h-9.32z"
    />
  </svg>
);

const AppleIcon = () => (
  <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
    <path
      fill="currentColor"
      d="M12.032 17.51a4.34 4.34 0 0 1-1.385.163 4.54 4.54 0 0 1-2.083-.561c-1.045-.523-2.252-1.74-2.9-3.26-1.51-3.49.03-7.01 1.41-8.59.72-.83 1.63-1.32 2.62-1.38 1.04-.06 2.06.37 2.89.37.8 0 1.92-.43 3.04-.37.95.06 2.14.52 2.76 1.25-.13.08-2.32 1.35-2.32 4.21 0 3.26 2.69 4.42 2.79 4.48a4.42 4.42 0 0 1-1.48 3.1c-.85.88-1.83 1.25-2.92 1.25a4.43 4.43 0 0 1-2.23-.63zm.63-13.06c-.63-.74-1.6-1.18-2.55-1.18-.9 0-1.95.5-2.68.95.83.65 1.48 1.66 1.83 2.66.58.22 1.25.33 1.93.33.1 0 .2-.03.3-.03.75-.15 1.42-.64 1.9-1.22-.24-.15-.47-.3-.73-.5z"
    />
  </svg>
);

export function UserAuthForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" disabled={isLoading} />
          </div>
          <Button disabled={isLoading}>
            {/* Add spinner icon when loading */}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button" disabled={isLoading}>
          <GoogleIcon /> Google
        </Button>
        <Button variant="outline" type="button" disabled={isLoading}>
          <AppleIcon /> Apple
        </Button>
      </div>
    </div>
  );
}
