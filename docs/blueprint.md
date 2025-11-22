# **App Name**: JobTrack app

## Core Features:

- Dashboard Stats: Display key application stats (Total, Applied, Interview, Offer, Rejected) in a clear, concise format.
- Application Listing & Management: Comprehensive listing with search, multi-filter (status, company, date), sorting, bulk actions, and swipe actions (mobile).
- Application Details: Timeline, attachments preview, timestamped notes, and follow-up reminders via calendar integration.
- AI Resume Feedback: Provide feedback on resume by allowing users to upload their resumes (PDF/DOCX) to obtain an overall score, bullet-point suggestions, and keyword optimization advice from the AI tool.
- AI Cover Letter Generation: Leverage uploaded resume and optional job description for AI-powered cover letter creation with selectable tone options.
- Add/Edit Application Form: A detailed form that has Company name/logo (auto-fetch or manual upload), position details, application specifics, status (color-coded), rich-text notes, and attachment support.
- User Authentication: Secure user authentication using Supabase Auth with email, Google, and Apple login options.

## Style Guidelines:

- Primary color: Indigo (#6366f1) to indicate an applied application status.
- Secondary colors: Amber (#f59e0b) to show an interview application status.
- Accent: Emerald (#10b981) to show an offer application status.
- Background: Light mode - #ffffff, Dark mode - #0f172a.
- Body and headline font: 'Inter' (sans-serif) for a clean, minimalist aesthetic. Note: currently only Google Fonts are supported.
- Minimalist flat design with generous whitespace for easy readability and a modern feel. Mobile-first card layout adapts to a table view on larger screens.
- Subtle micro-animations using framer-motion (web) and Reanimated 3 (mobile) on status changes and hover effects.