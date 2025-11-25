'use client';
import React from 'react';
import { useFirebase } from '../firebase';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RootPageClient() {
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();

  React.useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isUserLoading, router]);

  // Show a loading screen while we determine the user's auth state and redirect.
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
