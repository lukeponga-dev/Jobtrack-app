'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

const RecaptchaVerifyInputSchema = z.object({
  token: z.string(),
  recaptchaAction: z.string(),
});
export type RecaptchaVerifyInput = z.infer<typeof RecaptchaVerifyInputSchema>;

const RecaptchaVerifyOutputSchema = z.object({
  score: z.number().nullable(),
  valid: z.boolean(),
  invalidReason: z.string().optional(),
});
export type RecaptchaVerifyOutput = z.infer<
  typeof RecaptchaVerifyOutputSchema
>;

export async function recaptchaVerify(
  input: RecaptchaVerifyInput
): Promise<RecaptchaVerifyOutput> {
  return recaptchaVerifyFlow(input);
}

const recaptchaVerifyFlow = ai.defineFlow(
  {
    name: 'recaptchaVerifyFlow',
    inputSchema: RecaptchaVerifyInputSchema,
    outputSchema: RecaptchaVerifyOutputSchema,
  },
  async ({ token, recaptchaAction }) => {
    const projectID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!projectID || !recaptchaKey) {
      throw new Error('Missing reCAPTCHA environment variables.');
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
        return { score: null, valid: false, invalidReason: response.tokenProperties?.invalidReason?.toString() };
      }

      if (response.tokenProperties.action === recaptchaAction) {
        console.log(
          `The reCAPTCHA score is: ${response.riskAnalysis?.score}`
        );
        return { score: response.riskAnalysis?.score ?? null, valid: true };
      } else {
        console.log(
          'The action attribute in your reCAPTCHA tag does not match the action you are expecting to score'
        );
        return { score: null, valid: false, invalidReason: 'action_mismatch' };
      }
    } catch (error) {
      console.error("Error creating assessment:", error);
      throw error;
    }
  }
);
