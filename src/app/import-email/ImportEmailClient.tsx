'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wand2, Inbox, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  parseApplicationsFromEmail,
  type ParsedApplication,
} from '@/ai/flows/email-parser';
import { useFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { format } from 'date-fns';

const formSchema = z.object({
  emailContent: z.string().min(50, {
    message: 'Please paste a substantial amount of email text.',
  }),
});

export default function ImportEmailClient() {
  const [parsedApps, setParsedApps] = React.useState<ParsedApplication[]>([]);
  const [isParsing, setIsParsing] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const { toast } = useToast();
  const { firestore, user } = useFirebase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailContent: '',
    },
  });

  async function onParse(values: z.infer<typeof formSchema>) {
    setIsParsing(true);
    setParsedApps([]);
    try {
      const result = await parseApplicationsFromEmail(values);
      if (result.applications.length === 0) {
        toast({
          variant: 'default',
          title: 'No Applications Found',
          description:
            'The AI could not find any job applications in the text provided.',
        });
      }
      setParsedApps(result.applications);
    } catch (error) {
      console.error('Error parsing emails:', error);
      toast({
        variant: 'destructive',
        title: 'Parsing Failed',
        description: 'There was an error scanning the email text. Please try again.',
      });
    } finally {
      setIsParsing(false);
    }
  }

  const handleImport = async () => {
    if (!firestore || !user || parsedApps.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Import Failed',
        description: 'No applications to import or user not logged in.',
      });
      return;
    }

    setIsImporting(true);
    const applicationsCollectionRef = collection(
      firestore,
      'users',
      user.uid,
      'applications'
    );
    const importPromises: Promise<any>[] = [];

    for (const app of parsedApps) {
      const applicationData = {
        companyName: app.companyName,
        position: app.position,
        applicationDate: new Date(app.applicationDate).toISOString(),
        status: app.status,
        notes: `Imported from email on ${new Date().toLocaleDateString()}.`,
        userId: user.uid,
      };
      importPromises.push(
        addDocumentNonBlocking(applicationsCollectionRef, applicationData)
      );
    }

    try {
      await Promise.all(importPromises);
      toast({
        title: 'Import Successful',
        description: `${parsedApps.length} application(s) have been added to your tracker.`,
      });
      setParsedApps([]);
      form.reset();
    } catch (error) {
      console.error('Error saving applications:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Could not save the imported applications. Please try again.',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Paste Email Content</CardTitle>
          <CardDescription>
            Copy the full content of job-related emails and paste it here. You can paste multiple emails at once.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onParse)} className="space-y-6">
              <FormField
                control={form.control}
                name="emailContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Forward your job application emails to one place, then copy and paste their content here."
                        className="h-64 font-mono text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isParsing} className="w-full">
                {isParsing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Scan for Applications
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Review & Import</CardTitle>
            <CardDescription>
              Review the applications found by the AI. Click import to add them
              to your tracker.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isParsing && (
              <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-4 font-semibold">AI is scanning...</p>
                <p className="text-sm text-muted-foreground">
                  Extracting application details.
                </p>
              </div>
            )}
            {!isParsing && parsedApps.length === 0 && (
              <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
                <Inbox className="h-10 w-10 text-muted-foreground" />
                <p className="mt-4 font-semibold">Awaiting Email Content</p>
                <p className="text-sm text-muted-foreground">
                  Your scanned applications will appear here.
                </p>
              </div>
            )}
            {!isParsing && parsedApps.length > 0 && (
              <div className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedApps.map(app => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">
                            {app.companyName}
                          </TableCell>
                          <TableCell>{app.position}</TableCell>
                          <TableCell>
                            {format(new Date(app.applicationDate), 'PP')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {app.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Button
                  onClick={handleImport}
                  disabled={isImporting}
                  className="w-full"
                >
                  {isImporting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Import {parsedApps.length} Application(s)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
