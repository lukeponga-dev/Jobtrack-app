
'use server';

/**
 * @fileOverview Cover letter generation flow using resume and job description.
 *
 * - generateCoverLetter - A function that generates a cover letter.
 * - streamCoverLetter - A function that streams a generated cover letter.
 * - CoverLetterInput - The input type for the generateCoverLetter function.
 * - CoverLetterOutput - The return type for the generateCoverLetter function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

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

const coverLetterPrompt = ai.definePrompt({
  name: 'coverLetterPrompt',
  input: {schema: CoverLetterInputSchema},
  output: {schema: CoverLetterOutputSchema},
  model: googleAI.model('gemini-1.5-flash-latest'),
  prompt: `You are an expert career coach specializing in writing highly effective cover letters.

Your task is to create a compelling cover letter based on the provided resume and job description. The primary goal is to highlight the alignment between the candidate's skills and experience (from the resume) and the specific requirements of the job (from the job description).

Analyze both documents and write a cover letter in the specified tone. Be sure to weave in specific examples from the resume that demonstrate the candidate's qualifications for the role.

Resume:
{{resumeText}}

Job Description:
{{jobDescription}}

Tone: {{tone}}

Generate the cover letter now.`,
});


export async function generateCoverLetter(input: CoverLetterInput): Promise<CoverLetterOutput> {
  return generateCoverLetterFlow(input);
}

export async function streamCoverLetter(input: CoverLetterInput) {
    return generateCoverLetterStreamFlow(input);
}


const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: CoverLetterInputSchema,
    outputSchema: CoverLetterOutputSchema,
  },
  async input => {
    const { output } = await coverLetterPrompt(input);
    return output!;
  }
);


const generateCoverLetterStreamFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterStreamFlow',
    inputSchema: CoverLetterInputSchema,
    outputSchema: z.string(),
    stream: true,
  },
  async (input) => {
    const { stream } = await ai.generate({
        model: googleAI.model('gemini-1.5-flash-latest'),
        prompt: `You are an expert career coach specializing in writing highly effective cover letters.

Your task is to create a compelling cover letter based on the provided resume and job description. The primary goal is to highlight the alignment between the candidate's skills and experience (from the resume) and the specific requirements of the job (from the job description).

Analyze both documents and write a cover letter in the specified tone. Be sure to weave in specific examples from the resume that demonstrate the candidate's qualifications for the role.

Resume:
${input.resumeText}

Job Description:
${input.jobDescription || 'Not provided.'}

Tone: ${input.tone}

Generate the cover letter now.`,
        stream: true,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(chunk.text);
        }
        controller.close();
      },
    });

    return readableStream;
  }
);
