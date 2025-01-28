import { CoreStrapi, NotificationProvider } from '../../types';

export default ({ strapi }: { strapi: CoreStrapi }): NotificationProvider => ({
  async send(config, formName, data) {
    const recipients = await strapi.query('plugin::ezforms.recipient').findMany();
    //Loop through data and construct message from data object
    const formattedData = strapi.plugin('ezforms').service('formatData').formatData(data);
    const message = formName !== 'form' ? `${formName} \n ${formattedData}` : formattedData;

    const formattedDataHtml = strapi.plugin('ezforms').service('formatData').formatDataAsHtml(data);
    const htmlMessage =
      formName !== 'form' ? `<p><strong>${formName}</strong></p>${formattedDataHtml}` : formattedDataHtml;

    //loop through the recipients and send an email
    for (const recipient of recipients) {
      try {
        await strapi.plugins['email'].services.email.send({
          to: recipient.email,
          from: config.from,
          subject: config.subject ? config.subject : 'New Contact Form Submission',
          text: message,
          html: htmlMessage,
        });
      } catch (e) {
        strapi.log.error(e);
      }
    }
    return true;
  },
});
