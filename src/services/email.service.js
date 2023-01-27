const path = require('path');
const express = require('express');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
const Handlebars = require('handlebars');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');

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
      handlebars: allowInsecurePrototypeAccess(Handlebars),
    },
    viewPath: viewpath,
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowedProtoMethodsByDefault: true,
    },
  };

  transporter.use('compile', hbs(handlebarOptions));

  await transporter.sendMail({
    from: 'myancare.org.mm@',
    ...messageConfiguration,
  });
};

exports.sendWelcomeMessageToUser = async (to, data, totalFees) => {
  await this.sendMessage({
    to: to,
    subject: 'Welcome!',
    text: 'Its really workinggg',
    template: 'email',
    context: {
      order: data,
      total: totalFees,
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
