
'use client';

import * as React from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {Button} from '../../components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import {Textarea} from '../../components/ui/textarea';
import {RadioGroup, RadioGroupItem} from '../../components/ui/radio-group';
import {Card, CardContent, CardHeader, CardTitle} from '../../components/ui/card';
import {Clipboard, Loader2, Wand2} from 'lucide-react';
import {useToast} from '../../hooks/use-toast';
import {streamCoverLetter} from '../../ai/flows/cover-letter-generation';

const formSchema = z.object({
  resumeText: z.string().min(100, {
    message: 'Resume text must be at least 100 characters.',
  }),
  jobDescription: z.string().optional(),
  tone: z
    .enum(['professional', 'formal', 'friendly', 'informal'])
    .default('professional'),
});

export default function CoverLetterClient() {
  const [generatedLetter, setGeneratedLetter] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const {toast} = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeText: '',
      jobDescription: '',
      tone: 'professional',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedLetter('');
    try {
      const stream = await streamCoverLetter(values);
      if (typeof stream === 'string') {
        setGeneratedLetter(stream);
        return;
      }
      const reader = (stream as ReadableStream).getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setGeneratedLetter(prev => prev + chunk);
      }

    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description:
          'There was an error generating the cover letter. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast({
      title: 'Copied to clipboard!',
      description: 'The cover letter has been copied.',
    });
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Generator Inputs</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="resumeText"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Your Resume Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the full text of your resume here."
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobDescription"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Job Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the job description for better tailoring."
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tone"
                render={({field}) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Select a Tone</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-4"
                      >
                        {['professional', 'formal', 'friendly', 'informal'].map(
                          tone => (
                            <FormItem
                              key={tone}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={tone} />
                              </FormControl>
                              <FormLabel className="font-normal capitalize">
                                {tone}
                              </FormLabel>
                            </FormItem>
                          )
                        )}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate Cover Letter
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated Cover Letter</CardTitle>
            {generatedLetter && !isLoading && (
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                <Clipboard className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isLoading && !generatedLetter && (
              <div className="flex h-full min-h-96 items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-semibold">Generating...</p>
                <p className="text-sm text-muted-foreground">Crafting your cover letter.</p>
              </div>
            </div>
            )}
             <div
                className="prose prose-sm dark:prose-invert min-h-[500px] w-full max-w-none rounded-md border bg-muted/50 p-4 font-mono text-sm"
              >
                {generatedLetter || 'Your generated cover letter will appear here...'}
                {isLoading && (
                  <span className="inline-block h-4 w-2 animate-pulse bg-foreground" />
                )}
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
