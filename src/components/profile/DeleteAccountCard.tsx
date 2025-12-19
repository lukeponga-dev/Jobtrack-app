
'use client';

import * as React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '../ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { useFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { deleteUser } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

const DEMO_USER_ID = "mbjXKwJmpuNOCqW5CBBNi2Ppu1P2";


async function deleteUserSubcollections(firestore: any, userId: string) {
  const subcollections = ['applications', 'resumeFeedback', 'coverLetters'];
  for (const subcollection of subcollections) {
    const subcollectionRef = collection(firestore, 'users', userId, subcollection);
    const snapshot = await getDocs(subcollectionRef);
    if (!snapshot.empty) {
      const batch = writeBatch(firestore);
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }
  }
}

async function deleteUserDocument(firestore: any, userId: string) {
  const userDocRef = doc(firestore, 'users', userId);
  await deleteDoc(userDocRef);
}

export function DeleteAccountCard() {
  const { user, auth, firestore } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDeleteAccount = async () => {
    if (!user || !auth || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not delete account. User not found.',
      });
      return;
    }
    
    if (user.uid === DEMO_USER_ID) {
      toast({
        title: 'Demo Account Restriction',
        description: 'The demo account cannot be deleted.',
      });
      return;
    }


    setIsDeleting(true);

    try {
      // Delete Firestore data
      await deleteUserSubcollections(firestore, user.uid);
      await deleteUserDocument(firestore, user.uid);

      // Delete user from Auth
      await deleteUser(user);

      toast({
        title: 'Account Deleted',
        description: 'Your account and all associated data have been permanently deleted.',
      });

      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description:
          error.code === 'auth/requires-recent-login'
            ? 'Please sign in again to delete your account.'
            : error.message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>
          Permanently delete your account and all of your content. This action
          is not reversible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete My Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount} asChild>
                <Button variant="destructive">Confirm Deletion</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
