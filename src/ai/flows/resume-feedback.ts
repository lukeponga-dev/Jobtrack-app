'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing AI-powered feedback on resumes.
 *
 * - `getResumeFeedback` function: Accepts a resume file (PDF/DOCX) and returns an overall score, bullet-point suggestions, and keyword optimization advice.
 * - `ResumeFeedbackInput`: The input type for the `getResumeFeedback` function.
 * - `ResumeFeedbackOutput`: The return type for the `getResumeFeedback` function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const ResumeFeedbackInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "Resume file content, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>' (PDF or DOCX)."
    ),
});
export type ResumeFeedbackInput = z.infer<typeof ResumeFeedbackInputSchema>;

const ResumeFeedbackOutputSchema = z.object({
  overallScore: z.number().describe('Overall score of the resume (0-100).'),
  suggestions: z.array(z.string()).describe('Bullet-point suggestions for improvement.'),
  keywordOptimizations: z
    .array(z.string())
    .describe('Keyword optimization advice.'),
});
export type ResumeFeedbackOutput = z.infer<typeof ResumeFeedbackOutputSchema>;

export async function getResumeFeedback(input: ResumeFeedbackInput): Promise<ResumeFeedbackOutput> {
  return resumeFeedbackFlow(input);
}

const resumeFeedbackPrompt = ai.definePrompt({
  name: 'resumeFeedbackPrompt',
  input: {schema: ResumeFeedbackInputSchema},
  output: {schema: ResumeFeedbackOutputSchema},
  prompt: `You are an AI resume expert providing feedback on resumes.

  Analyze the resume provided and provide the following feedback:

  1.  Overall Score: Provide an overall score for the resume on a scale of 0-100.
  2.  Suggestions: Provide 3-5 bullet-point suggestions for improving the resume.
  3.  Keyword Optimizations: Suggest relevant keywords to optimize the resume for applicant tracking systems (ATS).

  Here is the resume:
  {{media url=resumeDataUri}}
  `,
});

const resumeFeedbackFlow = ai.defineFlow(
  {
    name: 'resumeFeedbackFlow',
    inputSchema: ResumeFeedbackInputSchema,
    outputSchema: ResumeFeedbackOutputSchema,
  },
  async input => {
    const {output} = await resumeFeedbackPrompt(input);
    return output!;
  }
);
