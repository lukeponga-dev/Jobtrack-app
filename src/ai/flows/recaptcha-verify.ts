'use server';

import { ai } from '../genkit';
import { z } from 'genkit';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

const RecaptchaInputSchema = z.object({
  token: z.string(),
  recaptchaAction: z.string(),
});
export type RecaptchaInput = z.infer<typeof RecaptchaInputSchema>;

const RecaptchaOutputSchema = z.object({
  isValid: z.boolean(),
  score: z.number().optional(),
});
export type RecaptchaOutput = z.infer<typeof RecaptchaOutputSchema>;

const projectID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const recaptchaKey = "6LcdwScsAAAAAOp-nSEU4N0flr--QiI26cOwPIFX";

export async function verifyRecaptcha(
  input: RecaptchaInput
): Promise<RecaptchaOutput> {
  return recaptchaVerifyFlow(input);
}

const recaptchaVerifyFlow = ai.defineFlow(
  {
    name: 'recaptchaVerifyFlow',
    inputSchema: RecaptchaInputSchema,
    outputSchema: RecaptchaOutputSchema,
  },
  async ({ token, recaptchaAction }) => {
    if (!projectID || !recaptchaKey) {
      console.error(
        'Project ID or reCAPTCHA site key is not defined in environment variables.'
      );
      return { isValid: false };
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
        console.log(
          `The CreateAssessment call failed because the token was: ${response.tokenProperties?.invalidReason}`
        );
        return { isValid: false };
      }

      if (response.tokenProperties.action === recaptchaAction) {
        const score = response.riskAnalysis?.score;
        console.log(`The reCAPTCHA score is: ${score}`);
        if (score === undefined) {
          return { isValid: false };
        }
        // Consider valid if score is above a certain threshold, e.g., 0.5
        return { isValid: score > 0.5, score };
      } else {
        console.log(
          'The action attribute in your reCAPTCHA tag does not match the action you are expecting to score'
        );
        return { isValid: false };
      }
    } catch (error) {
      console.error('Error creating assessment:', error);
      return { isValid: false };
    }
  }
);
