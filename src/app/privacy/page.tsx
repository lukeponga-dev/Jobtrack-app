
import LandingFooter from '@/components/layout/LandingFooter';
import LandingHeader from '@/components/layout/LandingHeader';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />

      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="prose prose-lg dark:prose-invert mx-auto">
            <h1>Privacy Policy</h1>
            <p className="lead">
              Your privacy is important to us. This Privacy Policy explains how
              JobTrack collects, uses, and protects your information.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              We collect information to provide and improve our services. The types
              of information we collect include:
            </p>
            <ul>
              <li>
                <strong>Account Information:</strong> When you create an account,
                we collect your name, email address, and authentication details
                provided by Firebase Authentication (such as Google account
                information or a secure password hash).
              </li>
              <li>
                <strong>Application Data:</strong> We store the job application
                details you provide, including company names, positions, dates,
                statuses, and any notes or attachments. This data is stored
                securely in Firestore and is tied to your user account.
              </li>
              <li>
                <strong>Resume and Cover Letter Data:</strong> For our AI
                features, we process the content of resumes and job descriptions
                you provide. This includes resume text for generating cover
                letters and resume files (PDF, DOCX) for feedback.
              </li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul>
              <li>
                To provide, maintain, and improve the JobTrack application.
              </li>
              <li>To personalize your experience and manage your job applications.</li>
              <li>
                To operate our AI-powered features, such as generating cover
                letters and providing resume feedback.
              </li>
              <li>To secure your account and protect against fraud.</li>
            </ul>

            <h2>3. AI Features and Data Processing</h2>
            <p>
              Our AI features (Resume Feedback and Cover Letter Generator) use
              Google's Gemini models via the Genkit framework. When you use these
              features, the data you provide (resume text, job descriptions, resume
              files) is sent to these models for processing. We do not store this
              data long-term for model training purposes. The data is used solely
              to generate the requested feedback or cover letter.
            </p>

            <h2>4. Data Security</h2>
            <p>
              We take data security seriously. Your data is stored in Firebase's
              secure Firestore database. We use Firebase Security Rules to ensure
              that only you can access, modify, or delete your own data. All data
              transmission is encrypted using standard security protocols.
            </p>

            <h2>5. Data Retention and Deletion</h2>
            <p>
              You have full control over your data. You can add, edit, and delete
              your job applications at any time through the application's
              dashboard. If you delete your account, all associated data,
              including your profile and application entries, will be permanently
              deleted.
            </p>

            <h2>6. Third-Party Services</h2>
            <p>
              We use Firebase for authentication and database services. Firebase's
              privacy policy also applies to the data they handle. We do not
              share your personal data with any other third parties for marketing
              or other purposes.
            </p>

            <h2>7. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal
              information at any time through your account settings and the
              application interface.
            </p>

            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify
              you of any significant changes by posting the new policy on this
              page.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact
              us at privacy@jobtrack.app.
            </p>

            <p>
              <em>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em>
            </p>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
