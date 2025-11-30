'use client';
import React from 'react';
import { useFirebase } from '../firebase';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LandingPage from './LandingPage';

export default function RootPageClient() {
  const { user, isUserLoading, areServicesAvailable } = useFirebase();
  const router = useRouter();

  React.useEffect(() => {
    if (areServicesAvailable && !isUserLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, router, areServicesAvailable]);

  if (!areServicesAvailable || isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  // Render loading state while redirecting for logged-in users
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
