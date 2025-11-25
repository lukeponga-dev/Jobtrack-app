'use client';

import * as React from 'react';
import {CheckCircle, Lightbulb, Loader2, Upload, XCircle} from 'lucide-react';
import {Button} from '../../components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '../../components/ui/card';
import {getResumeFeedback} from '../../ai/flows/resume-feedback';
import type {ResumeFeedbackOutput} from '../../ai/flows/resume-feedback';
import {Progress} from '../../components/ui/progress';
import {Badge} from '../../components/ui/badge';
import {useToast} from '../../hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function ResumeFeedbackClient() {
  const [file, setFile] = React.useState<File | null>(null);
  const [feedback, setFeedback] = React.useState<ResumeFeedbackOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const {toast} = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload a file smaller than 5MB.',
        });
        return;
      }
      setFile(selectedFile);
      setFeedback(null);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a resume file to analyze.',
      });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      const resumeDataUri = await fileToDataUri(file);
      const result = await getResumeFeedback({resumeDataUri});
      setFeedback(result);
    } catch (error) {
      console.error('Error getting resume feedback:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'There was an error analyzing your resume. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Upload Resume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                {file ? 'Click to change file' : 'Click to upload'}
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx"
            />
            {file && <p className="text-sm font-medium">Selected: {file.name}</p>}
            <Button
              onClick={handleAnalyzeClick}
              disabled={!file || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Analyze Resume
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {isLoading && (
          <div className="flex h-full min-h-96 items-center justify-center rounded-lg border bg-card">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg font-semibold">Analyzing your resume...</p>
              <p className="text-sm text-muted-foreground">This may take a moment.</p>
            </div>
          </div>
        )}
        {!isLoading && !feedback && (
          <div className="flex h-full min-h-96 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card text-center">
            <Lightbulb className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Get Instant Feedback</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Upload your resume and click &quot;Analyze&quot; to see your results.
            </p>
          </div>
        )}
        {feedback && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold text-primary">{feedback.overallScore}</span>
                  <span className="text-2xl font-medium text-muted-foreground">/ 100</span>
                </div>
                <Progress value={feedback.overallScore} />
              </CardContent>
            </Card>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Suggestions for Improvement</AlertTitle>
              <AlertDescription>
                <ul className="list-disc space-y-2 pl-5">
                  {feedback.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb /> Keyword Optimizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {feedback.keywordOptimizations.map((kw, i) => (
                    <Badge key={i} variant="secondary">{kw}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
