
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { useToast } from '../../hooks/use-toast';
import { useFirebase } from '../../firebase';
import { updateProfile } from 'firebase/auth';
import { Card, CardHeader, CardTitle, CardContent, CardDescription as CardDescriptionComponent } from '../ui/card';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email(),
});

const DEMO_USER_ID = "mbjXKwJmpuNOCqW5CBBNi2Ppu1P2";


export function UpdateProfileForm() {
  const { user, auth } = useFirebase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.displayName || '',
      email: user?.email || '',
    },
  });
  
  React.useEffect(() => {
    if (user) {
      form.reset({
        name: user.displayName || '',
        email: user.email || '',
      });
    }
  }, [user, form]);

  const isDemoUser = user?.uid === DEMO_USER_ID;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;

    if (isDemoUser) {
      toast({
        title: 'Demo Account Restriction',
        description: 'Updating the demo account profile is not allowed.',
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile(user, {
        displayName: values.name,
      });
      toast({
        title: 'Profile Updated',
        description: 'Your name has been successfully updated.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
        <CardDescriptionComponent>View and update your personal information.</CardDescriptionComponent>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} disabled={isLoading || isDemoUser} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email" {...field} disabled />
                  </FormControl>
                  <FormDescription>
                    {isDemoUser 
                      ? 'The demo account profile cannot be modified.' 
                      : 'Your email address cannot be changed.'
                    }
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading || isDemoUser}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
