# JobTrack: Your AI-Powered Job Application Hub

JobTrack is a modern, full-stack web application designed to streamline and supercharge your job search. Built with Next.js, Firebase, and cutting-edge GenAI, it provides a comprehensive suite of tools to manage applications, get AI-driven feedback, and craft the perfect cover letter. It features a sleek, mobile-first design and can be installed on any device for a native-app experience.

This project was bootstrapped and developed with [Firebase Studio](https://firebase.google.com/docs/studio).

## ✨ Features

*   **🏠 Landing Page:** A beautiful, welcoming page for new and returning users.
*   **📄 Application Dashboard:** A central hub to track all your job applications. View, add, edit, delete, and filter your applications by status (Applied, Interview, Offer, Rejected).
*   **⬆️ CSV Import:** Easily import your existing job application data from a CSV file to get started quickly.
*   **🤖 AI Resume Feedback:** Upload your resume (PDF or DOCX) and receive instant, AI-powered analysis. Get an overall score, actionable suggestions for improvement, and relevant keyword optimizations to beat the Applicant Tracking Systems (ATS).
*   **✍️ AI Cover Letter Generator:** Paste your resume and a job description to instantly generate a tailored cover letter. You can even choose the tone that best fits the company culture.
*   **📱 Responsive & Installable:** A fully responsive, mobile-first UI with a collapsible sidebar and a bottom navigation bar for easy access. Install the app to your device home screen for a native PWA experience.
*   **👤 User Authentication & Profile:** Securely sign in with Google or email/password. Manage your profile details on a dedicated settings page.
*   **☀️ Dark & Light Mode:** A sleek, modern interface with a theme toggle to switch between light and dark modes.

## 🚀 Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth)
*   **Database:** [Cloud Firestore](https://firebase.google.com/docs/firestore)
*   **Generative AI:** [Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
*   **Deployment:** Ready for deployment on services like [Firebase App Hosting](https://firebase.google.com/docs/app-hosting) or [Render](https://render.com/).

## 🏁 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/jobtrack.git
cd jobtrack
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

This project requires a Firebase project to run.

1.  **Create a Firebase Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Enable Authentication:** In the Firebase Console, go to **Build > Authentication** and enable the **Email/Password** and **Google** sign-in methods.
3.  **Enable Firestore:** In the Firebase Console, go to **Build > Firestore Database** and create a database. Start in **test mode** for initial development (you can secure it later with the provided `firestore.rules`).
4.  **Get Firebase Config:**
    *   In your Firebase project, go to **Project Settings** (the gear icon).
    *   Under "Your apps," create a new **Web app**.
    *   Copy the `firebaseConfig` object.
5.  **Create Environment File:**
    *   In the root of your project, create a new file named `.env.local`.
    *   Add your Firebase configuration to this file. It should look like this:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
    NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
    ```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌐 Deployment

This application is ready to be deployed to any hosting service that supports Next.js, such as [Firebase App Hosting](https://firebase.google.com/docs/app-hosting), Vercel, or Render. The included `apphosting.yaml` and `render.yaml` files provide configuration for those specific platforms.
