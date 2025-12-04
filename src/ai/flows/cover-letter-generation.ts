
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
import {StreamingFlow} from '@genkit-ai/core/lib/streaming';

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

const fallbackCoverLetter = `[Your Name]
[Your Address] | [Your Phone Number] | [Your Email]

[Date]

[Hiring Manager Name] (If known, otherwise use title)
[Hiring Manager Title]
[Company Name]
[Company Address]

Dear [Mr./Ms./Mx. Last Name],

I am writing to express my keen interest in the [Job Title] position at [Company Name], which I discovered through [Platform where you saw the advertisement, e.g., LinkedIn, company website]. Having followed [Company Name]'s work in [mention something specific, e.g., the tech industry, their recent project], I am deeply impressed by your commitment to [mention a company value or achievement].

With a background in [Your Field] and experience in [mention 1-2 key skills from your resume, e.g., 'full-stack web development' and 'agile methodologies'], I am confident that I possess the skills and qualifications necessary to excel in this role. My resume highlights my experience in [mention a key achievement, e.g., 'leading a project that increased user engagement by 15%'].

I am particularly drawn to this opportunity because [explain why you are interested in this specific role and company]. My skills in [mention another skill] align perfectly with the requirements for this position.

I am eager to discuss how my experience can benefit [Company Name]. Thank you for your time and consideration. I look forward to hearing from you soon.

Sincerely,
[Your Name]
`;


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
    try {
      const result = await coverLetterPrompt(input);
      return result.output!;
    } catch (err) {
      console.error("Cover letter generation failed, using fallback.", err);
      return {
        coverLetter: `// AI model could not be reached. Using a fallback template.\n\n${fallbackCoverLetter}`
      };
    }
  }
);


async function generateCoverLetterStreamFlow(input: CoverLetterInput) {
  try {
    const streamingResponse = await ai.run(coverLetterPrompt, {
      input,
      stream: true,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of (streamingResponse as any).stream()) {
          controller.enqueue(chunk.output?.coverLetter);
        }
        controller.close();
      },
    });

    return readableStream;

  } catch (err) {
    console.error("Cover letter streaming failed, using fallback.", err);
    const fallbackStream = new ReadableStream({
      start(controller) {
        controller.enqueue(`// AI model could not be reached. Using a fallback template.\n\n${fallbackCoverLetter}`);
        controller.close();
      },
    });
    return fallbackStream;
  }
}
