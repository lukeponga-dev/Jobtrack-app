
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
import {googleAI} from '@genkit-ai/google-genai';

const ResumeFeedbackInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "Resume file content, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>' (PDF or DOCX)."
    ),
   resumeText: z.string().optional().describe("The extracted text from the resume, for fallback scoring."),
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


function tokenize(s: string): string[] {
  if (!s) return [];
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function heuristicScore(resume: string | undefined): number {
  if (!resume) return 30; // Return a baseline score if no text is available
  const resumeTokens = tokenize(resume);
  // A simple heuristic based on length and keyword density
  const lengthScore = Math.min(50, (resumeTokens.length / 500) * 50);
  const commonKeywords = ['experience', 'education', 'skills', 'projects', 'react', 'node', 'javascript', 'python'];
  const keywordHits = resumeTokens.filter(token => commonKeywords.includes(token)).length;
  const keywordScore = Math.min(50, (keywordHits / 5) * 50);
  return Math.round(Math.max(0, Math.min(100, lengthScore + keywordScore)));
}

function fallbackSummary(text: string | undefined): string[] {
    if (!text) return ["Résumé content was empty or unavailable."];
    const t = text.replace(/\s+/g, " ").trim();
    if (t.length > 800) {
        return [`${t.slice(0, 800)}…`];
    }
    return [t];
}


export async function getResumeFeedback(input: ResumeFeedbackInput): Promise<ResumeFeedbackOutput> {
  return resumeFeedbackFlow(input);
}

const resumeFeedbackFlow = ai.defineFlow(
  {
    name: 'resumeFeedbackFlow',
    inputSchema: ResumeFeedbackInputSchema,
    outputSchema: ResumeFeedbackOutputSchema,
  },
  async input => {
    const resumeFeedbackPrompt = ai.definePrompt({
      name: 'resumeFeedbackPrompt',
      input: {schema: ResumeFeedbackInputSchema},
      output: {schema: ResumeFeedbackOutputSchema},
      model: googleAI.model('gemini-1.5-flash-latest'),
      prompt: `You are an AI resume expert providing feedback on resumes.

  Analyze the resume provided and provide the following feedback:

  1.  Overall Score: Provide an overall score for the resume on a scale of 0-100.
  2.  Suggestions: Provide 3-5 bullet-point suggestions for improving the resume.
  3.  Keyword Optimizations: Suggest relevant keywords to optimize the resume for applicant tracking systems (ATS).

  Here is the resume:
  {{media url=resumeDataUri}}
  `,
    });
    
    try {
      console.info("Calling Gemini for resume feedback...");
      const {output} = await resumeFeedbackPrompt(input);
      return output!;
    } catch (err) {
      console.error("Gemini API call failed, using fallback.", err);
      // Fallback logic
      const score = heuristicScore(input.resumeText);
      const summary = fallbackSummary(input.resumeText);

      return {
          overallScore: score,
          suggestions: [
              "The AI model could not be reached, but we performed a basic analysis.",
              ...summary,
          ],
          keywordOptimizations: ["AI analysis unavailable"],
      };
    }
  }
);
