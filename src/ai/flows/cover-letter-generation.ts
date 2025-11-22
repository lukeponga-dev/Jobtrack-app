'use server';

/**
 * @fileOverview Cover letter generation flow using resume and job description.
 *
 * - generateCoverLetter - A function that generates a cover letter.
 * - CoverLetterInput - The input type for the generateCoverLetter function.
 * - CoverLetterOutput - The return type for the generateCoverLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CoverLetterInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the uploaded resume.'),
  jobDescription: z
    .string()
    .optional()
    .describe('The job description for the target position.'),
  tone: z
    .enum(['formal', 'informal', 'professional', 'friendly'])
    .default('professional')
    .describe('The desired tone of the cover letter.'),
});
export type CoverLetterInput = z.infer<typeof CoverLetterInputSchema>;

const CoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter.'),
});
export type CoverLetterOutput = z.infer<typeof CoverLetterOutputSchema>;

export async function generateCoverLetter(input: CoverLetterInput): Promise<CoverLetterOutput> {
  return generateCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'coverLetterPrompt',
  input: {schema: CoverLetterInputSchema},
  output: {schema: CoverLetterOutputSchema},
  prompt: `You are an expert cover letter writer.

  Given the following resume and job description, write a cover letter with the specified tone.

  Resume:
  {{resumeText}}

  Job Description:
  {{jobDescription}}

  Tone: {{tone}}

  Cover Letter:`, // No need to escape backticks here
});

const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: CoverLetterInputSchema,
    outputSchema: CoverLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
