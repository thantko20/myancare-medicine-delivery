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

exports.sendOrderConfirmationMessageToUser = async (to, data, totalFees) => {
  await this.sendMessage({
    to: to,
    subject: 'Order Confirmation from MyanCare Medicine Delivery.',
    template: 'email',
    context: {
      order: data,
      total: totalFees,
    },
  });
};

exports.sendOrderShippedMessageToUser = async (to, userName) => {
  await this.sendMessage({
    to: to,
    subject: 'Order Shipping has been done by MyanCare.',
    template: 'shipped',
    context: {
      name: userName,
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
