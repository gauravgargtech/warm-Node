const email = require("../adapters/mailer");
const path = require("path");
const NodeCache = require("node-cache");
const logger = require("../common/logger");
const fs = require("fs");
const sequelize = require("../adapters/mysql");
const blogModel = require("../models/blogs")(sequelize);
const lodash = require("lodash");
const { validationResult } = require("express-validator");
const QueryModel = require("../models/queries")(sequelize);
const moment = require("moment");
const requestIp = require("request-ip");

module.exports = {
  home: (req, res) => {
    res.render("index", {
      csrfToken: "j",
    });
  },
  plans: (req, res) => {
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
  contact: (req, res) => {
    let errorMessage = req.flash("contact");

    return res.render("pages/contact", {
      errorMessage: !lodash.isEmpty(errorMessage) ? errorMessage : false,
    });
  },

  blog: async (req, res) => {
    let blogs = await blogModel.findAll({
      raw: true,
    });
    res.render("pages/blog", {
      allBlogs: blogs,
    });
  },

  blogDetail: async (req, res) => {
    const urlParts = req.url.split("/");
    let blog = await blogModel.findAll({
      where: {
        url: urlParts[2],
      },
      raw: true,
    });
    res.render("pages/blog_detail", {
      blogDetail: blog,
    });
  },

  contactSubmit: async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("pages/contact", {
        errorMessage: errors.array()[0].msg,
      });
    }

    await QueryModel.create({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      ip_address: requestIp.getClientIp(req),
    });

    req.flash(
      "contact",
      "Thanks for contacting us, we will get back to you soon."
    );
    return res.redirect("/contact");
  },
};
