import DashboardLayout from "../dashboard/layout";
import CoverLetterClient from './CoverLetterClient';

export default function CoverLetterPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            AI Cover Letter Generator
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Paste your resume and a job description to instantly generate a
            tailored cover letter. Choose a tone that fits your personality and
            the company culture.
          </p>
        </header>
        <CoverLetterClient />
      </div>
    </DashboardLayout>
  );
}
