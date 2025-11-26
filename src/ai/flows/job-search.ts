'use server';

/**
 * @fileOverview A flow to search for jobs using AI.
 *
 * - searchJobs - A function that searches for jobs based on a query.
 * - JobSearchInput - The input type for the searchJobs function.
 * - JobSearchOutput - The return type for the searchJobs function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const JobPostSchema = z.object({
  id: z.string().describe('A unique identifier for the job post.'),
  title: z.string().describe('The title of the job position.'),
  company: z.string().describe('The name of the company hiring.'),
  location: z.string().describe('The location of the job (e.g., "San Francisco, CA").'),
  description: z.string().describe('A brief description of the job.'),
  url: z.string().url().describe('The URL to the full job posting.'),
});

const JobSearchInputSchema = z.object({
  query: z.string().describe('The user\'s search query for jobs (e.g., "software engineer in new york").'),
});
export type JobSearchInput = z.infer<typeof JobSearchInputSchema>;

const JobSearchOutputSchema = z.object({
  jobs: z.array(JobPostSchema).describe('A list of fictional job postings that match the query.'),
});
export type JobSearchOutput = z.infer<typeof JobSearchOutputSchema>;
export type JobPost = z.infer<typeof JobPostSchema>;


export async function searchJobs(input: JobSearchInput): Promise<JobSearchOutput> {
  return searchJobsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobSearchPrompt',
  input: {schema: JobSearchInputSchema},
  output: {schema: JobSearchOutputSchema},
  prompt: `You are a helpful job search assistant. Your task is to generate a list of 10 fictional job postings based on the user's search query.

For each job posting, you must provide a title, company name, location, a short description (2-3 sentences), and a placeholder URL to a fictional job posting page.

User Query:
"{{query}}"

Generate a list of 10 fictional job postings now.`,
});

const searchJobsFlow = ai.defineFlow(
  {
    name: 'searchJobsFlow',
    inputSchema: JobSearchInputSchema,
    outputSchema: JobSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
