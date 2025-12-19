
# JobTrack: Your AI-Powered Job Application Hub

![JobTrack Dashboard](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxqb2IlMjBzZWFyY2glMjBvcmdhbml6YXRpb258ZW58MHx8fHwxNzE4NzU0MDIwfDA&ixlib=rb-4.1.0&q=80&w=1080)

**JobTrack is a modern, full-stack web application designed to streamline and supercharge your job search.** Built with Next.js, Firebase, and cutting-edge GenAI, it provides a comprehensive suite of tools to manage applications, get AI-driven feedback, and craft the perfect cover letter.

This project was bootstrapped and developed with [Firebase Studio](https://firebase.google.com/docs/studio).

<p align="center">
  <a href="https://play.google.com/store/apps/details?id=co.median.android.lpppkjr" target="_blank"><img src="https://img.shields.io/badge/Google_Play-414141?style=for-the-badge&logo=google-play&logoColor=white" alt="Get it on Google Play"></a>
  <a href="https://nextjs.org/" target="_blank"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"></a>
  <a href="https://firebase.google.com/" target="_blank"><img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase"></a>
  <a href="https://firebase.google.com/docs/genkit" target="_blank"><img src="https://img.shields.io/badge/Genkit-6E4EFF?style=for-the-badge&logo=google&logoColor=white" alt="Genkit"></a>
  <a href="https://tailwindcss.com/" target="_blank"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
</p>

## ✨ Core Features

-   **🏠 Beautiful Landing Page:** A welcoming page for new and returning users.
-   **📊 Application Dashboard:** A central hub to track all your job applications. View, add, edit, delete, and filter your applications by status (Applied, Interview, Offer, Rejected).
-   **📱 Responsive & Installable:** A fully responsive, mobile-first UI with a collapsible sidebar and a bottom navigation bar. Install the app to your device home screen for a native PWA experience.
-   **👤 User Authentication:** Securely sign in with Google or email/password.
-   **⚙️ Profile Management:** Manage your name and password on a dedicated settings page.
-   **☀️ Dark & Light Mode:** A sleek, modern interface with an automatic theme toggle.

## 🤖 AI-Powered Capabilities

Leverage the power of Google's Gemini models to get a competitive edge:

-   **🔍 AI Job Search:** Discover fictional job opportunities tailored to your search queries.
-   **📄 AI Resume Feedback:** Upload your resume (PDF or DOCX) and receive instant, AI-powered analysis, including an overall score, actionable suggestions, and keyword optimizations to beat Applicant Tracking Systems (ATS).
-   **✍️ AI Cover Letter Generator:** Paste your resume and a job description to instantly generate a tailored cover letter in various tones.
-   **📥 CSV & Email Import:** Easily import your existing job application data from a CSV file or by pasting raw email content to get started quickly.

## 🚀 Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth)
-   **Database:** [Cloud Firestore](https://firebase.google.com/docs/firestore)
-   **Generative AI:** [Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
-   **Deployment:** Ready for deployment on services like [Firebase App Hosting](https://firebase.google.com/docs/app-hosting) or [Render](https://render.com/).

## 🏁 Getting Started with Firebase Studio

This project is optimized for development within **Firebase Studio**. The environment is pre-configured, and all necessary services are provisioned automatically.

### 1. Run the Application

Simply run the application within the Firebase Studio environment. The development server will start, and the app will be accessible in the integrated web preview.

### 2. Set Up Environment Variables

AI features require a Google AI API key.

1.  Create a `.env` file in the root of the project.
2.  Add your API key to the file:

    ```env
    GEMINI_API_KEY="your-google-ai-api-key"
    ```

    You can obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 3. Try the Live Demo

To explore the app's features without creating an account, use the "Live Demo" button on the login page with the following pre-configured credentials:

-   **Email:** `demo@jobtrack.com`
-   **Password:** `demo123`

*Note: The demo account has read-only permissions for sample data. You cannot edit or delete the pre-populated job applications, but you can add your own.*

### 4. Automatic Backend Provisioning

Firebase Studio automatically handles the backend setup:

-   A Firebase project is created or connected for you.
-   Firebase Authentication and Firestore are enabled.
-   Security rules from `firestore.rules` are automatically deployed.
-   The necessary Firebase configuration is injected into the app.

There is no need to manually create a Firebase project or configure service credentials.

## 🌐 Deployment

This application is ready to be deployed to any hosting service that supports Next.js. The included `apphosting.yaml` and `render.yaml` files provide out-of-the-box configuration for Firebase App Hosting and Render, respectively.
