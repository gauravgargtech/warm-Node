const nodemailer = require("nodemailer");
const Email = require("email-templates");
const path = require("path");
const config = require("../config/keys");

const transport = nodemailer.createTransport({
  port: config.email.port,
  host: config.email.host,
  secure: false,
  auth: {
    user: config.email.username,
    pass: config.email.password,
  },
});

const email = new Email({
  message: {
    from: config.email.from,
  },
  send: true,
  transport: transport,
  views: {
    root: path.join(path.dirname(__dirname), "/", "views", "/", "emails"),
    options: {
      extension: "ejs",
    },
  },
});

module.exports = email;
