
'use client';

import * as React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { useFirebase } from '../../firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useToast } from '../../hooks/use-toast';
import { Loader2, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const GoogleIcon = () => (
  <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
    <path
      fill="currentColor"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.73 1.9-3.41 0-6.2-2.73-6.2-6.08s2.79-6.08 6.2-6.08c1.84 0 3.22.71 4.21 1.64l2.5-2.5c-1.59-1.47-3.68-2.34-6.71-2.34-5.52 0-10 4.48-10 10s4.48 10 10 10c5.73 0 9.5-3.87 9.5-9.66 0-.6-.07-1.18-.18-1.72h-9.32z"
    />
  </svg>
);

export function UserAuthForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSigningUp, setIsSigningUp] = React.useState(false);
  const {auth} = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  const handleAuthAction = async (authFunction: () => Promise<any>) => {
    if (!auth) return;
    setIsLoading(true);
    try {
      await authFunction();
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

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    
    await handleAuthAction(async () => {
      if (isSigningUp) {
        await createUserWithEmailAndPassword(auth!, email, password);
      } else {
        await signInWithEmailAndPassword(auth!, email, password);
      }
    });
  }

  const handleGoogleSignIn = async () => {
    await handleAuthAction(async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth!, provider);
    });
  };

  const handleDemoLogin = async () => {
    await handleAuthAction(async () => {
      await signInWithEmailAndPassword(auth!, 'demo@jobtrack.com', 'demo123');
    });
  };

  if (!auth) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <form id="auth-form" onSubmit={onSubmit}>
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
            <Input
              id="password"
              name="password"
              type="password"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
          >
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
      <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={handleGoogleSignIn}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <GoogleIcon /> Google
        </Button>
       <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or
          </span>
        </div>
      </div>
      <Button
        variant="secondary"
        type="button"
        disabled={isLoading}
        onClick={handleDemoLogin}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <PlayCircle className="mr-2 h-4 w-4" />
        )}
        Live Demo
      </Button>
    </div>
  );
}
