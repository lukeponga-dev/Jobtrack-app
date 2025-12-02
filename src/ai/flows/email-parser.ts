
'use server';

/**
 * @fileOverview A flow to parse job application data from raw email text.
 *
 * - parseApplicationsFromEmail - A function that takes a string of email content and returns structured application data.
 * - EmailParseInput - The input type for the function.
 * - EmailParseOutput - The return type for the function.
 */

import { ai } from '../genkit';
import { z } from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const ParsedApplicationSchema = z.object({
  id: z.string().describe("A temporary unique ID for this parsed application."),
  companyName: z.string().describe('The name of the company.'),
  position: z.string().describe('The job position or title.'),
  applicationDate: z.string().describe('The date of the application or email, in ISO 8601 format (YYYY-MM-DD).'),
  status: z
    .enum(['applied', 'interview', 'offer', 'rejected'])
    .describe(
      'The inferred status of the application. Default to "applied" if unclear.'
    ),
});

const EmailParseInputSchema = z.object({
  emailContent: z
    .string()
    .min(50)
    .describe('The raw text content of one or more emails related to job applications.'),
});
export type EmailParseInput = z.infer<typeof EmailParseInputSchema>;

const EmailParseOutputSchema = z.object({
  applications: z.array(ParsedApplicationSchema).describe('An array of structured job application objects parsed from the email text.'),
});
export type EmailParseOutput = z.infer<typeof EmailParseOutputSchema>;
export type ParsedApplication = z.infer<typeof ParsedApplicationSchema>;

export async function parseApplicationsFromEmail(
  input: EmailParseInput
): Promise<EmailParseOutput> {
  return emailParserFlow(input);
}

const emailParserFlow = ai.defineFlow(
  {
    name: 'emailParserFlow',
    inputSchema: EmailParseInputSchema,
    outputSchema: EmailParseOutputSchema,
  },
  async input => {
    const prompt = ai.definePrompt({
      name: 'emailParserPrompt',
      input: { schema: EmailParseInputSchema },
      output: { schema: EmailParseOutputSchema },
      model: googleAI.model('gemini-1.5-flash-latest'),
      prompt: `You are an expert data extraction agent specializing in job applications. Your task is to parse the following raw email text and extract all job applications into a structured JSON format.

RULES:
- Identify each distinct job application mentioned in the text.
- For each application, extract the company name, the job position/title, and the date of the email or application.
- Infer the application status. If the email mentions an interview, "next steps", or scheduling, set status to "interview". If it is a confirmation, set it to "applied". If it is a rejection, set it to "rejected". If it's an offer, set it to "offer". Default to "applied" if you are unsure.
- The date should be formatted as YYYY-MM-DD. Use the current year if no year is specified.
- Generate a short, unique temporary ID for each application found.
- Return an array of application objects.

Email Content:
---
{{{emailContent}}}
---

Extract the application data now.`,
    });

    const { output } = await prompt(input);
    return output!;
  }
);
