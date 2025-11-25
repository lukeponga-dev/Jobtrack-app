'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useToast } from '../../hooks/use-toast';
import { useFirebase, addDocumentNonBlocking } from '../../firebase';
import { collection } from 'firebase/firestore';
import type { ApplicationStatus } from '../../lib/types';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Info } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';

type ImportApplicationsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
};

const requiredHeaders = ['company', 'role', 'dateApplied', 'status'];

const statusMap: { [key: string]: ApplicationStatus } = {
  'expired': 'rejected',
  'unlikely to progress': 'rejected',
  'not selected': 'rejected',
  'interviewing': 'interview',
  'applied': 'applied',
  'viewed': 'applied',
};


export function ImportApplicationsDialog({ open, onOpenChange, onImportComplete }: ImportApplicationsDialogProps) {
  const { toast } = useToast();
  const { firestore, user } = useFirebase();
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv') {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a CSV file.',
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleImport = () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a CSV file to import.',
      });
      return;
    }
    if (!firestore || !user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to import applications.',
      });
      return;
    }

    setIsImporting(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: header => header.trim(),
      complete: (results) => {
        const headers = results.meta.fields;
        if (!headers || !requiredHeaders.every(h => headers.includes(h))) {
          toast({
            variant: 'destructive',
            title: 'Invalid CSV Headers',
            description: `Your CSV must include the following headers: ${requiredHeaders.join(', ')}`,
          });
          setIsImporting(false);
          return;
        }

        const applicationsCollectionRef = collection(firestore, 'users', user.uid, 'applications');
        const importPromises: Promise<any>[] = [];

        results.data.forEach((row: any) => {
          const rawStatus = (row.status || 'applied').toLowerCase().trim();
          const status: ApplicationStatus = statusMap[rawStatus] || 'applied';

          let applicationDate;
          const dateString = row.dateApplied;
          // More robust date parsing
          const dateFormats = ['M/d/yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd', 'd/M/yyyy', "MM/dd/yy", "M/d/yy"];
          let parsedDate: Date | null = null;
          
          if(dateString){
            for (const formatStr of dateFormats) {
                const date = parse(dateString, formatStr, new Date());
                if (isValid(date)) {
                  // Check if the year is in the future, if so, adjust it to the current year or a past year.
                  // This handles cases like 10/2/2025 from the provided data.
                  // For this example, we'll just use the parsed date as is, but you could add logic here.
                  parsedDate = date;
                  break;
                }
            }
          }

          if (parsedDate) {
            applicationDate = parsedDate.toISOString();
          } else {
            // Fallback to today's date if parsing fails
            applicationDate = new Date().toISOString();
          }


          const applicationData = {
            companyName: row.company || '',
            position: row.role || '',
            applicationDate: applicationDate,
            status: status,
            notes: row.notes || '',
            userId: user.uid,
          };

          // Basic validation
          if (applicationData.companyName && applicationData.position) {
            importPromises.push(addDocumentNonBlocking(applicationsCollectionRef, applicationData));
          }
        });
        
        Promise.all(importPromises)
          .then(() => {
            onImportComplete();
            onOpenChange(false);
            setFile(null);
          })
          .catch((error) => {
             toast({
                variant: 'destructive',
                title: 'Import Failed',
                description: 'An error occurred while importing. Please check your data and try again.',
             });
          })
          .finally(() => {
            setIsImporting(false);
          });
      },
      error: (error) => {
        toast({
            variant: 'destructive',
            title: 'Parsing Error',
            description: 'Could not parse the CSV file. Please check its format.',
        });
        setIsImporting(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Job Applications</DialogTitle>
          <DialogDescription>
            Upload a CSV file with your job application data.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>CSV Format Guide</AlertTitle>
                <AlertDescription>
                    <p className="mb-2">Your CSV file must include the following headers:</p>
                    <ul className="list-disc list-inside text-xs space-y-1">
                        <li><code className="font-mono bg-muted px-1 py-0.5 rounded">company</code></li>
                        <li><code className="font-mono bg-muted px-1 py-0.5 rounded">role</code></li>
                        <li><code className="font-mono bg-muted px-1 py-0.5 rounded">dateApplied</code> (e.g., M/d/yyyy)</li>
                        <li><code className="font-mono bg-muted px-1 py-0.5 rounded">status</code></li>
                    </ul>
                     <p className="mt-2 text-xs">Optional headers: <code className="font-mono bg-muted px-1 py-0.5 rounded">notes</code></p>
                </AlertDescription>
            </Alert>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="csv-file">CSV File</Label>
                <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} />
            </div>
            {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleImport} disabled={!file || isImporting}>
            {isImporting ? 'Importing...' : 'Import Applications'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
