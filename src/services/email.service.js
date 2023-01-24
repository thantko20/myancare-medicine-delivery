const path = require('path');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');

const {
  EMAIL_HOST,
  EMAIL_PASSWORD,
  EMAIL_PORT,
  EMAIL_USERNAME,
} = require('../constants');

exports.sendMessage = async (messageConfiguration) => {
  let transporter = createTransport();
  const viewpath = path.join(__dirname, '../views');

  const handlebarOptions = {
    viewEngine: {
      defaultLayout: false,
    },
    viewPath: viewpath,
  };
  transporter.use('compile', hbs(handlebarOptions));

  await transporter.sendMail({
    from: 'myancare.org.mm@',
    ...messageConfiguration,
  });
};

exports.sendWelcomeMessageToUser = async (to, name) => {
  await this.sendMessage({
    to: to,
    subject: 'Welcome!',
    text: 'Its really workinggg',
    template: 'email',
    context: {
      userName: name,
    },
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
