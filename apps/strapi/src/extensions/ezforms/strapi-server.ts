import '@strapi/strapi';
import axios from 'axios';

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

export default (plugin: any) => {
  plugin.services.hcaptcha = ({ strapi }: { strapi: any }) => ({
    async validate(token) {
      if (!token) {
        strapi.log.error('Missing hCaptcha Token');
        return {
          valid: false,
          message: 'Missing token',
          code: 400,
        };
      }
      const secret = strapi.config.get('plugin.ezforms.captchaProvider.config.secret');
      const sitekey = strapi.config.get('plugin.ezforms.captchaProvider.config.sitekey');
      const url = `https://hcaptcha.com/siteverify`;

      let hCaptcha_verify: { data: HCaptchaVerifyResponse } | undefined;
      try {
        hCaptcha_verify = await axios.post(
          url,
          new URLSearchParams({
            secret,
            sitekey,
            response: token,
            // remoteip?
          }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        // console.log(hCaptcha_verify);
      } catch (e) {
        strapi.log.error(e);
        return {
          valid: false,
          message: 'Unable to verify captcha',
          code: 500,
        };
      }

      if (!hCaptcha_verify.data.success) {
        strapi.log.error('hCaptcha_verify');
        strapi.log.error(hCaptcha_verify);
        return {
          valid: false,
          message: 'Unable to verify captcha',
          code: 500,
        };
      }

      // ENTERPRISE feature: a score denoting malicious activity.
      if ((hCaptcha_verify.data.score || 0) >= strapi.config.get('plugin.ezforms.captchaProvider.config.score')) {
        return {
          valid: false,
          message: 'Risk Score too high',
          code: 400,
        };
      }
      return {
        score: hCaptcha_verify.data.score || '',
        valid: true,
      };
    },
  });
  return plugin;
};
