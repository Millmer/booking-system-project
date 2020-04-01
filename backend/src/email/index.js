const fs = require('fs');
const Services = require('../services');

module.exports = {
  async send(userEmail, template, mergeVars) {
    try {
      const HTML = await getHtmlTemplate(template, mergeVars);
      const params = {
        Destination: {
          ToAddresses: [userEmail]
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: HTML
            }
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `Booking Information from Booking System`
          }
        },
        Source: `"Booking System" <${process.env.BOOKINGS_EMAIL}>`
      };
      const result = await Services.Amazon.sendEmail(params);
      console.info('Email sending result %j', result);
      return HTML;
    } catch (exception) {
      console.error(exception);
      throw {
        statusCode: 500,
        statusMessage: 'CANNOT_SEND_EMAIL'
      };
    }
  }
}

async function getHtmlTemplate(template, mergeVars) {
  const hash = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
  console.time(`Reading File (${hash})`);
  let HTML = await fs.readFileSync(`${__dirname}/templates/${template}.html`, 'utf-8');
  const IMAGES_ROOT_PATH = process.env.IMAGES_ROOT_PATH;
  mergeVars = {...mergeVars, IMAGES_ROOT_PATH};
  for (const key in mergeVars) {
    const regex = new RegExp("{{" + key + "}}", "ig");
    HTML = HTML.replace(regex, mergeVars[key]);
  }
  console.timeEnd(`Reading File (${hash})`);
  return HTML;
}