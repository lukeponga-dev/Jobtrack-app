
import {
  FileText,
  UploadCloud,
  Wand2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import LandingHeader from '@/components/layout/LandingHeader';
import LandingFooter from '@/components/layout/LandingFooter';

const features = [
  {
    icon: <UploadCloud className="h-8 w-8" />,
    title: 'Centralized Dashboard',
    description: 'Track all your job applications in one place. View, add, edit, and filter by status.',
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: 'AI Resume Feedback',
    description: 'Upload your resume and get instant, AI-powered analysis to improve your chances.',
  },
  {
    icon: <Wand2 className="h-8 w-8" />,
    title: 'AI Cover Letter Generator',
    description: 'Instantly generate tailored cover letters based on your resume and a job description.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto flex flex-col items-center justify-center px-4 py-20 text-center md:py-32">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Supercharge Your Job Search
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            JobTrack is your AI-powered hub to manage applications, get resume feedback, and craft the perfect cover letter.
          </p>
          <div className="mt-8 flex gap-4">
            <Button asChild size="lg">
              <Link href="/login">Get Started for Free</Link>
            </Button>
          </div>
          <div className="relative mt-12 w-full max-w-4xl">
             <Image
                src="https://picsum.photos/seed/dashboard-shot/1200/600"
                alt="JobTrack Dashboard Screenshot"
                width={1200}
                height={600}
                className="rounded-xl border shadow-2xl"
                data-ai-hint="app dashboard"
              />
               <div className="absolute -bottom-4 -right-4 -left-4 h-full rounded-xl bg-primary/10 -z-10" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-muted py-20 sm:py-32">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                All-in-One Job Application Toolkit
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to stay organized and stand out.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-card p-6 text-center shadow-sm"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
