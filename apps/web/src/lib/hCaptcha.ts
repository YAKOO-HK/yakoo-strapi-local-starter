import { env } from '@/env';

const VERIFY_URL = env.HCAPTCHA_VERIFY_URL;
const SECRET = env.HCAPTCHA_SECRET || '';
const SITE_KEY = env.NEXT_PUBLIC_HCAPTCHA_SITEKEY || '';
// const SCORE_THRESHOLD = env.HCAPTCHA_SCORE_THRESHOLD;

type HCaptchaVerifyError = string | string[];
type HCaptchaVerifyResponse = {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  credit?: boolean;
  'error-codes'?: HCaptchaVerifyError;
  score?: number;
  score_reason?: string[];
};

export async function verifyCaptcha(response: string) {
  const hCaptchaVerifyResponse = await fetch(VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: SECRET,
      sitekey: SITE_KEY,
      response,
      // TODO: remoteip?
    }),
    next: { revalidate: 0 }, // Disable Next.js revalidation
  });

  if (!hCaptchaVerifyResponse.ok) {
    console.error('hCaptcha verification failed:', hCaptchaVerifyResponse);
    throw new Error('Unknown error has occurred.');
  }
  const hCaptchaVerifyResponseJson = await hCaptchaVerifyResponse.json();
  const { success } = hCaptchaVerifyResponseJson as HCaptchaVerifyResponse;
  return success;
}
