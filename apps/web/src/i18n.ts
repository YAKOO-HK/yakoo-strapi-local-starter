import { getRequestConfig } from 'next-intl/server';

type GetRequestConfig = ReturnType<typeof getRequestConfig>;
const requestConfigGetter: GetRequestConfig = getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
export default requestConfigGetter;
