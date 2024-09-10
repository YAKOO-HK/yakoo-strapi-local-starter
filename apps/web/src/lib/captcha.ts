import { env } from '@/env';

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

type TurnstileVerifyError = string[];
type TurnstileVerifyResponse =
  | {
      success: true;
      challenge_ts: string;
      hostname: string;
      'error-codes': TurnstileVerifyError;
      action: string;
      cdata: string;
    }
  | { success: false; 'error-codes': TurnstileVerifyError };

export async function verifyCaptcha(response: string) {
  if (env.NEXT_PUBLIC_CAPTCHA_PROVIDER === 'hcaptcha') {
    const hCaptchaVerifyResponse = await fetch(env.HCAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: env.HCAPTCHA_SECRET || '',
        sitekey: env.NEXT_PUBLIC_HCAPTCHA_SITEKEY || '',
        response,
        // TODO: remoteip?
      }),
      next: { revalidate: 0 }, // Disable Next.js revalidation
    });

    if (!hCaptchaVerifyResponse.ok) {
      console.error('hCaptcha verification failed:', hCaptchaVerifyResponse);
      throw new Error('Unknown error has occurred.');
    }
    // const SCORE_THRESHOLD = env.HCAPTCHA_SCORE_THRESHOLD;
    const hCaptchaVerifyResponseJson = await hCaptchaVerifyResponse.json();
    const { success } = hCaptchaVerifyResponseJson as HCaptchaVerifyResponse;
    return success;
  } else if (env.NEXT_PUBLIC_CAPTCHA_PROVIDER === 'turnstile') {
    const verifyResponse = await fetch(env.CLOUDFLARE_TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: env.CLOUDFLARE_TURNSTILE_SECRET,
        response,
        // TODO: remoteip?
      }),
      next: { revalidate: 0 }, // Disable Next.js revalidation
    });
    if (!verifyResponse.ok) {
      console.error('Captcha verification failed:', verifyResponse);
      throw new Error('Unknown error has occurred.');
    }
    const verifyResponseJson: TurnstileVerifyResponse = await verifyResponse.json();
    return verifyResponseJson.success;
  }
  return false; // no captcha provider configured
}
