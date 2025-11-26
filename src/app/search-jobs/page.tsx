import DashboardLayout from "../dashboard/layout";
import JobSearchClient from "./JobSearchClient";

export default function JobSearchPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            AI-Powered Job Search
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Discover new opportunities with our AI-driven job search. Find roles
            and add them directly to your tracker with one click.
          </p>
        </header>
        <JobSearchClient />
      </div>
    </DashboardLayout>
  );
}
