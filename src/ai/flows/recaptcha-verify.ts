
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

const RecaptchaVerifyInputSchema = z.object({
  token: z.string(),
  expectedAction: z.string(),
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
  async ({ token, expectedAction }) => {
    const projectID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!projectID || !recaptchaKey) {
      console.error('Missing reCAPTCHA environment variables: NEXT_PUBLIC_FIREBASE_PROJECT_ID or NEXT_PUBLIC_RECAPTCHA_SITE_KEY');
      throw new Error('Server is not configured for reCAPTCHA verification.');
    }

    const client = new RecaptchaEnterpriseServiceClient();
    const projectPath = client.projectPath(projectID);

    const request = {
      assessment: {
        event: {
          token: token,
          siteKey: recaptchaKey,
          expectedAction: expectedAction
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

      // The API automatically checks if the expectedAction matches the action from the client.
      // If they don't match, `response.tokenProperties.valid` will be false with `invalidReason: "ACTION_MISMATCH"`.
      // So, we just need to check the 'valid' property.
      console.log(
        `The reCAPTCHA score is: ${response.riskAnalysis?.score}`
      );
      return { score: response.riskAnalysis?.score ?? null, valid: true };

    } catch (error) {
      console.error("Error creating reCAPTCHA assessment:", error);
      throw new Error('Could not verify reCAPTCHA token.');
    }
  }
);
