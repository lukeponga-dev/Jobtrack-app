import { config } from 'dotenv';
config();

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

import './flows/cover-letter-generation.ts';
import './flows/resume-feedback.ts';
import './flows/job-search.ts';
import './flows/email-parser.ts';

genkit({
    plugins: [googleAI()],
    enableTracingAndMetrics: true,
});
