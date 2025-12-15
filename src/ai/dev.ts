
import { config } from 'dotenv';
config();

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Import flows so they are registered with the dev server
import './flows/cover-letter-generation';
import './flows/resume-feedback';
import './flows/job-search';
import './flows/email-parser';


export default genkit({
    plugins: [
        googleAI(),
    ],
});
