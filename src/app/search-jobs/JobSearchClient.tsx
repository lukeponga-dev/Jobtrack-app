
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
  FormMessage,
  FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, PlusCircle, Search, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { searchJobs, type JobPost } from '@/ai/flows/job-search';
import { useFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import Link from 'next/link';

const formSchema = z.object({
  query: z.string().min(3, {
    message: 'Search query must be at least 3 characters.',
  }),
  location: z.string().optional(),
});

const JobResultCard = ({ job, onAdd }: { job: JobPost, onAdd: (job: JobPost) => void }) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription>{job.company} - {job.location}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => onAdd(job)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add to Tracker
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                <Link href={job.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
                    View Job Post
                </Link>
            </CardContent>
        </Card>
    )
}

export default function JobSearchClient() {
  const [searchResults, setSearchResults] = React.useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const { firestore, user } = useFirebase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
      location: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSearchResults([]);
    try {
      const result = await searchJobs(values);
      setSearchResults(result.jobs);
    } catch (error: any) {
      console.error('Error searching for jobs:', error);
      const errorMessage = error.message || '';
      
      if (errorMessage.includes('403') && errorMessage.includes('are blocked')) {
         toast({
          variant: 'destructive',
          title: 'AI Service Disabled',
          description: (
            <div>
              <p>The Generative Language API is not enabled for your project.</p>
              <a
                href="https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-white underline"
              >
                Click here to enable it
              </a>
              , then try again.
            </div>
          ),
          duration: 10000,
         });
      } else {
         toast({
          variant: 'destructive',
          title: 'Search Failed',
          description: 'There was an error searching for jobs. Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddToTracker = (job: JobPost) => {
    if (!firestore || !user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to add an application.',
      });
      return;
    }

    const applicationData = {
      companyName: job.company,
      position: job.title,
      applicationDate: new Date().toISOString(),
      status: 'applied' as const,
      notes: job.description,
      jobUrl: job.url,
      userId: user.uid,
    };

    const applicationsCollectionRef = collection(firestore, 'users', user.uid, 'applications');
    addDocumentNonBlocking(applicationsCollectionRef, applicationData);

    toast({
      title: 'Application Added',
      description: `The application for ${job.title} at ${job.company} has been added to your tracker.`,
    });
  };

  return (
    <div className="space-y-8">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <FormField
                        control={form.control}
                        name="query"
                        render={({ field }) => (
                        <FormItem className="md:col-span-3">
                            <FormLabel>Job Title or Keyword</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="e.g., Product Manager" className="pl-10" {...field} />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                        <FormItem className="md:col-span-2">
                             <FormLabel>Location</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="e.g., San Francisco, CA" className="pl-10" {...field} />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                    {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                    'Search Jobs'
                    )}
                </Button>
            </form>
        </Form>
        
        <div className="space-y-4">
            {isLoading && (
                <div className="flex flex-col items-center justify-center pt-16">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Searching for jobs...</p>
                </div>
            )}

            {!isLoading && searchResults.length === 0 && (
                 <div className="flex h-full min-h-96 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card text-center">
                    <Search className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">Find Your Next Opportunity</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Enter a job title and location to start your search.
                    </p>
                </div>
            )}

            {!isLoading && searchResults.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                    {searchResults.map(job => (
                        <JobResultCard key={job.id} job={job} onAdd={handleAddToTracker} />
                    ))}
                </div>
            )}
        </div>
    </div>
  );
}
