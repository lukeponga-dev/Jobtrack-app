'use client';

import * as React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { useAuth } from '../../firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GithubAuthProvider,
} from 'firebase/auth';
import { useToast } from '../../hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const GoogleIcon = () => (
  <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
    <path
      fill="currentColor"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.73 1.9-3.41 0-6.2-2.73-6.2-6.08s2.79-6.08 6.2-6.08c1.84 0 3.22.71 4.21 1.64l2.5-2.5c-1.59-1.47-3.68-2.34-6.71-2.34-5.52 0-10 4.48-10 10s4.48 10 10 10c5.73 0 9.5-3.87 9.5-9.66 0-.6-.07-1.18-.18-1.72h-9.32z"
    />
  </svg>
);

const GithubIcon = () => (
    <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
        <path
        fill="currentColor"
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
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
  const [isSigningUp, setIsSigningUp] = React.useState(false);
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    if (!auth) return;

    setIsLoading(true);
    const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      if (isSigningUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    if (!auth) return;
    setIsLoading(true);
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'GitHub Sign-In Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!auth) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
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
            <Input id="password" name="password" type="password" disabled={isLoading} />
          </div>
          <Button disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSigningUp ? 'Sign Up with Email' : 'Sign In with Email'}
          </Button>
        </div>
      </form>
      <Button
        variant="link"
        size="sm"
        className="mx-auto -mt-2"
        onClick={() => setIsSigningUp(!isSigningUp)}
      >
        {isSigningUp
          ? 'Already have an account? Sign In'
          : "Don't have an account? Sign Up"}
      </Button>
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
        <Button variant="outline" type="button" disabled={isLoading} onClick={handleGoogleSignIn}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <GoogleIcon /> Google
        </Button>
        <Button variant="outline" type="button" disabled={isLoading} onClick={handleGithubSignIn}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <GithubIcon /> GitHub
        </Button>
      </div>
    </div>
  );
}
