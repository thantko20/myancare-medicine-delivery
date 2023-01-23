const nodemailer = require('nodemailer');

const {
  EMAIL_HOST,
  EMAIL_PASSWORD,
  EMAIL_PORT,
  EMAIL_USERNAME,
} = require('../constants');

exports.sendMessage = async (messageConfiguration) => {
  const transporter = createTransport();

  await transporter.sendMail({
    from: 'Myancare myancare.org.mm',
    ...messageConfiguration,
  });
};

exports.sendWelcomeMessageToUser = async ({ to }) => {
  await this.sendMessage({
    to,
    html: '<h1>Hello World</h1>',
    subject: 'Welcome!',
  });
};

function createTransport() {
  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  });
}
