
import {
  CalendarCheck,
  KanbanSquare,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import LandingHeader from '@/components/layout/LandingHeader';
import LandingFooter from '@/components/layout/LandingFooter';

const features = [
  {
    icon: <KanbanSquare className="h-8 w-8" />,
    title: 'Track Everything',
    description: 'Go beyond spreadsheets. Manage your applications, contacts, and deadlines in one visual pipeline.',
  },
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: 'AI-Powered Insights',
    description: "Get instant feedback on your resume and generate tailored cover letters that catch recruiters' attention.",
  },
  {
    icon: <CalendarCheck className="h-8 w-8" />,
    title: 'Stay Organized',
    description: 'Never miss a follow-up. Set reminders, store notes, and keep your job search on track.',
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
            Don't just apply. Apply smarter.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            JobTrack is the ultimate toolkit for job seekers, designed to give you an edge in today's competitive market.
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
