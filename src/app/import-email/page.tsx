import DashboardLayout from '../dashboard/layout';
import ImportEmailClient from './ImportEmailClient';

export default function ImportEmailPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Import from Email
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Paste the content of one or more job application emails below. Our
            AI will scan the text and extract your applications automatically.
          </p>
        </header>
        <ImportEmailClient />
      </div>
    </DashboardLayout>
  );
}
