import DashboardLayout from "../dashboard/layout";
import ResumeFeedbackClient from './ResumeFeedbackClient';

export default function ResumeFeedbackPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">AI Resume Feedback</h1>
          <p className="max-w-2xl text-muted-foreground">
            Upload your resume (PDF or DOCX) to get an instant analysis. Our AI will provide an overall score, actionable suggestions, and keyword optimizations to help you stand out.
          </p>
        </header>
        <ResumeFeedbackClient />
      </div>
    </DashboardLayout>
  );
}
