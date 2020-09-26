const email = require("../adapters/mailer");
const path = require("path");
const NodeCache = require("node-cache");
const logger = require("../common/logger");
const fs = require("fs");
const sequelize = require("../adapters/mysql");
const blogModel = require("../models/blogs")(sequelize);

module.exports = {
  home: (req, res) => {
    //req.logger.info("Startig up ");
    //req.logger.warn('this is warning');
    //logger.debug(" This is first error logger");
    console.log(req.session, req.session.userId);
    res.render("index");
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
};
