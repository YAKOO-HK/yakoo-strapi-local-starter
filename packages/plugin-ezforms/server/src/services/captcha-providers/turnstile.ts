import axios from 'axios';
import { CaptchaProvider, CoreStrapi } from '../../types';

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

export default ({ strapi }: { strapi: CoreStrapi }): CaptchaProvider => ({
  async validate(token) {
    if (!token) {
      strapi.log.error('Missing turnstile Token');
      return {
        valid: false,
        message: 'Missing token',
        code: 400,
      };
    }
    const secret = strapi.config.get('plugin::ezforms.captchaProvider.config.secret');
    // const sitekey = strapi.config.get('plugin::ezforms.captchaProvider.config.sitekey');
    const url = `https://challenges.cloudflare.com/turnstile/v0/siteverify`;
    const requestContext = strapi.requestContext.get();
    const remoteip = requestContext?.request.ip;

    let turnstile_verify: { data: TurnstileVerifyResponse };
    try {
      turnstile_verify = await axios.post(url, {
        secret,
        response: token,
        remoteip,
      });
      // console.log(turnstile_verify);
    } catch (e) {
      strapi.log.error(e);
      return {
        valid: false,
        message: 'Unable to verify captcha',
        code: 500,
      };
    }

    // console.log(turnstile_verify.data);
    if (!turnstile_verify.data.success) {
      strapi.log.warn('turnstile_verify failed');
      strapi.log.warn(JSON.stringify(turnstile_verify.data));
      return {
        valid: false,
        message: 'Unable to verify captcha',
        code: 500,
      };
    }
    return {
      score: null,
      valid: true,
    };
  },
});
