'use client';

import React from 'react';
import { useFirebase } from '../../firebase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { UpdateProfileForm } from '../../components/profile/UpdateProfileForm';

export default function ProfileClient() {
  const { user, isUserLoading } = useFirebase();

  if (isUserLoading) {
    return (
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You must be logged in to view this page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl">
      <UpdateProfileForm />
    </div>
  );
}
