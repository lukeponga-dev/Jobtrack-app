'use client';
import React, { useState, useEffect } from 'react';
import { useFirebase } from '../firebase';
import { Loader2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ApplicationCards } from '@/components/dashboard/ApplicationCards';
import DashboardPage from './dashboard/page';

const features = [
  {
    title: 'Application Dashboard',
    description: 'A central hub to track all your job applications. View, add, edit, delete, and filter your applications by status.',
    icon: '📄'
  },
  {
    title: 'AI Resume Feedback',
    description: 'Upload your resume and receive instant, AI-powered analysis to beat the Applicant Tracking Systems (ATS).',
    icon: '🤖'
  },
  {
    title: 'AI Cover Letter Generator',
    description: 'Instantly generate a tailored cover letter from your resume and a job description.',
    icon: '✍️'
  },
  {
    title: 'Secure Authentication',
    description: 'Sign in with Google or email/password. Manage your profile on a dedicated settings page.',
    icon: '👤'
  }
];

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Logo />
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-16 text-center sm:py-24">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Your AI-Powered Job Application Hub
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Streamline your job search with powerful AI tools. Track applications, get resume feedback, and generate cover letters—all in one place.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/login">Get Started for Free</Link>
            </Button>
          </div>
        </section>

        <section className="bg-muted py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">Features to Supercharge Your Search</h2>
              <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
                JobTrack provides all the tools you need to land your dream job faster.
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-lg border bg-card p-6 text-center">
                  <div className="text-4xl">{feature.icon}</div>
                  <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 text-center">
             <h2 className="text-3xl font-bold tracking-tight">Ready to Get Started?</h2>
             <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                Sign up today and take control of your job search. Your next career move is just a click away.
             </p>
             <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="/login">Create Your Account</Link>
                </Button>
             </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 text-sm text-muted-foreground">
            <Logo />
            <p>&copy; {new Date().getFullYear()} JobTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}


export default function RootPageClient() {
  const { user, isUserLoading } = useFirebase();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isUserLoading || !isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <DashboardPage />;
  }

  return <LandingPage />;
}
