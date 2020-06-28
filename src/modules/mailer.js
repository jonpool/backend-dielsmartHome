const express = require('express');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const {host, port, user, pass} = require("../config/mail.json")

var transport = nodemailer.createTransport({
  host,
  port,
  auth:{
        user,
        pass
      }
});

//aqui esta o problema
const handlebarOptions = {
  viewEngine: {
    extName: '.html',
    partialsDir: path.resolve('./src/resources/'),
    layoutsDir: path.resolve('./src/resources/'),
    defaultLayout: 'templates/forgot_password.html',
    
  },
  viewPath: path.resolve('./src/resources/'),
  extName: '.html',
};

transport.use('compile', hbs(handlebarOptions));
module.exports = transport;