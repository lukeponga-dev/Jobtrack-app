import { config } from 'dotenv';
config();

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { nextDev } from '@genkit-ai/next';

import './flows/cover-letter-generation.ts';
import './flows/resume-feedback.ts';
import './flows/job-search.ts';
import './flows/email-parser.ts';

export default genkit({
    plugins: [googleAI(), nextDev()],
    enableTracingAndMetrics: true,
});
