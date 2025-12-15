'use server';
/**
 * @fileOverview A Genkit flow for verifying reCAPTCHA tokens.
 *
 * - recaptchaVerifyFlow - A function that takes a reCAPTCHA token and expected action, and returns a validity assessment.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

const RecaptchaInputSchema = z.object({
  token: z.string().describe('The reCAPTCHA token generated on the client.'),
  expectedAction: z.string().describe('The action name associated with the token (e.g., LOGIN).'),
});

const RecaptchaOutputSchema = z.object({
  valid: z.boolean().describe('Whether the token is valid and the action matches.'),
  score: z.number().optional().describe('The risk score from the assessment.'),
});

export async function recaptchaVerifyFlow(
  input: z.infer<typeof RecaptchaInputSchema>
): Promise<z.infer<typeof RecaptchaOutputSchema>> {
  return recaptchaFlow(input);
}

const recaptchaFlow = ai.defineFlow(
  {
    name: 'recaptchaVerifyFlow',
    inputSchema: RecaptchaInputSchema,
    outputSchema: RecaptchaOutputSchema,
  },
  async ({ token, expectedAction }) => {
    const projectID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!projectID || !recaptchaKey) {
      console.error('Missing reCAPTCHA environment variables.');
      throw new Error('Server configuration error for reCAPTCHA.');
    }

    const client = new RecaptchaEnterpriseServiceClient();
    const projectPath = client.projectPath(projectID);

    const request = {
      assessment: {
        event: {
          token: token,
          siteKey: recaptchaKey,
        },
      },
      parent: projectPath,
    };

    try {
      const [response] = await client.createAssessment(request);

      if (!response.tokenProperties?.valid) {
        console.log(`Invalid token: ${response.tokenProperties?.invalidReason}`);
        return { valid: false };
      }

      if (response.tokenProperties.action !== expectedAction) {
        console.log(`Action mismatch: Expected ${expectedAction}, got ${response.tokenProperties.action}`);
        return { valid: false };
      }
      
      const score = response.riskAnalysis?.score;
      console.log(`reCAPTCHA score: ${score}`);

      // Consider a score of > 0.5 as valid. Adjust as needed.
      if (score === undefined || score === null || score < 0.5) {
        return { valid: false, score };
      }

      return { valid: true, score };
    } catch (error) {
      console.error('Error creating reCAPTCHA assessment:', error);
      // In case of an error with the service, fail open or closed based on security policy.
      // Failing closed (returning false) is generally safer.
      return { valid: false };
    }
  }
);
