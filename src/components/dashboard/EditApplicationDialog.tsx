
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useToast } from '../../hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { useFirebase, updateDocumentNonBlocking } from '../../firebase';
import { doc } from 'firebase/firestore';
import type { Application } from '../../lib/types';
import React from 'react';

const formSchema = z.object({
  companyName: z.string().min(2, { message: 'Company name is required.' }),
  position: z.string().min(2, { message: 'Position is required.' }),
  applicationDate: z.date({ required_error: 'Date applied is required.' }),
  status: z.enum(['applied', 'interview', 'offer', 'rejected']),
  notes: z.string().optional(),
});

type EditApplicationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: Application | null;
};

export function EditApplicationDialog({ open, onOpenChange, application }: EditApplicationDialogProps) {
  const { toast } = useToast();
  const { firestore, user } = useFirebase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  React.useEffect(() => {
    if (application) {
      form.reset({
        companyName: application.companyName,
        position: application.position,
        applicationDate: new Date(application.applicationDate),
        status: application.status,
        notes: Array.isArray(application.notes) ? application.notes.map(n => n.text).join('\n\n') : (application.notes || ''),
      });
    }
  }, [application, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !user || !application) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Invalid request. Please try again.',
      });
      return;
    }

    const applicationData = {
      ...values,
      applicationDate: values.applicationDate.toISOString(),
    };

    const applicationDocRef = doc(firestore, 'users', user.uid, 'applications', application.id);
    
    updateDocumentNonBlocking(applicationDocRef, applicationData);

    toast({
      title: 'Application Updated',
      description: `Your application for ${values.position} at ${values.companyName} has been updated.`,
    });
    onOpenChange(false);
  }
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Application</DialogTitle>
          <DialogDescription>
            Update the details of your job application.
          </DialogDescription>
        </DialogHeader>
        {application && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Google" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="applicationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date Applied</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select application status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any notes here..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
