import axios from 'axios';
import { CaptchaProvider, CoreStrapi } from '../../types';

export default ({ strapi }: { strapi: CoreStrapi }): CaptchaProvider => ({
  async validate(token) {
    if (!token) {
      strapi.log.error('Missing Recaptcha Token');
      return {
        valid: false,
        message: 'Missing token',
        code: 400,
      };
    }
    const secret_key = strapi.config.get('plugin::ezforms.captchaProvider.config.secretKey');
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;
    let recaptcha_verify;
    try {
      recaptcha_verify = await axios.post(url);
    } catch (e) {
      strapi.log.error(e);
      return {
        valid: false,
        message: 'Unable to verify captcha',
        code: 500,
      };
    }

    if (!recaptcha_verify.data.success) {
      strapi.log.error('recaptcha_verify');
      strapi.log.error(recaptcha_verify);
      return {
        valid: false,
        message: 'Unable to verify captcha',
        code: 500,
      };
    }
    if (recaptcha_verify.data.score < Number(strapi.config.get('plugin::ezforms.captchaProvider.config.score') ?? 0)) {
      return {
        valid: false,
        message: 'Score Not High Enough',
        code: 400,
      };
    }
    return {
      score: recaptcha_verify.data.score,
      valid: true,
    };
  },
});
