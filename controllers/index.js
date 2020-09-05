const email = require("../adapters/mailer");
const path = require("path");
const NodeCache = require("node-cache");
const logger = require("../common/logger");
const fs = require("fs");

module.exports = {
  home: (req, res) => {
    //req.logger.info("Startig up ");
    //req.logger.warn('this is warning');
    logger.debug(" This is first error logger");
    console.log(req.session, req.session.userId);
    res.render("index");
  },
  plans: (req, res) => {
    const read = fs.createReadStream('kjhkjhjk.txt');
    console.log(read);
    logger.debug(' this is data fff');
    res.render("pages/plans");
  },
  policy: (req, res) => {
    res.render("pages/policy");
  },
  faq: (req, res) => {
    res.render("pages/faq");
  },
  terms: (req, res) => {
    res.render("pages/terms");
  },
  contact: async (req, res) => {
    return res.render("pages/contact");
    await email
      .send({
        template: "register",
        message: {
          to: "gauravgargtech2@gmail.com",
          subject: "sample noder",
        },
        locals: {
          name: "Gaurav Garg",
        },
      })
      .then((res) => {
        console.log("--success");
        console.log(res);
      })
      .catch((err) => {
        console.log("err");
        console.log(err);
      });

    res.render("pages/contact");
  },
};
