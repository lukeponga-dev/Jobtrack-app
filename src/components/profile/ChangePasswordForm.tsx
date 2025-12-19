
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { useToast } from '../../hooks/use-toast';
import { useFirebase } from '../../firebase';
import { updatePassword } from 'firebase/auth';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  newPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const DEMO_USER_ID = "mbjXKwJmpuNOCqW5CBBNi2Ppu1P2";


export function ChangePasswordForm() {
  const { user } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    
    if (user.uid === DEMO_USER_ID) {
      toast({
        title: 'Demo Account Restriction',
        description: 'Changing the password for the demo account is not allowed.',
      });
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword(user, values.newPassword);
      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully updated.',
      });
      form.reset();
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        toast({
            variant: 'destructive',
            title: 'Action Required',
            description: 'This is a sensitive action. Please sign in again to change your password.',
        });
        // Redirect to login or show a re-authentication modal
        router.push('/login');
      } else {
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your password here. After saving, you may be required to log in again.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
