const sequelize = require("../adapters/mysql");
const UserModel = require("../models/users")(sequelize);
const md5 = require("md5");
const lodash = require("lodash");
const commonLogin = require("../common/login");
const { validationResult } = require("express-validator");
const functions = require("../common/functions");
const email = require("../adapters/mailer");
const Cryptr = require("cryptr");
const { reset } = require("nodemon");
const cryptr = new Cryptr("jhgjh786786y87hbj");

module.exports = {
  login: (req, res) => {
    let errorMessage = req.flash("loginError");

    res.render("users/login", {
      errorMessage: !lodash.isEmpty(errorMessage) ? errorMessage : false,
      csrfToken: req.csrfToken(),
    });
  },

  performLogin: async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("users/login", {
        errorMessage: errors.array()[0].msg,
        csrfToken: req.csrfToken(),
      });
    }

    let email = req.body.email;
    let password = req.body.password;

    result = await UserModel.findAll({
      where: {
        email: email,
        password: md5(password),
      },
      raw: true,
    });

    await commonLogin.setLogin(result, req, res);

    /*
    UserModel.create({
      email: email,
      password: password,
    })
      .then((result) => {
        console.log("----success");
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });

*/
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      console.log(err);
      res.redirect("/");
    });
  },

  register: (req, res) => {
    let errorMessage = req.flash("registerError");

    res.render("users/register", {
      errorMessage: !lodash.isEmpty(errorMessage) ? errorMessage : false,
      csrfToken: req.csrfToken(),
    });
  },

  performRegistration: (req, res) => {
    commonLogin
      .registerUser(req.body)
      .then((result) => {
        let record = result.get({ plain: true });
        if (record) {
          commonLogin.setLogin([record], req, res);
        }
      })
      .catch((err) => {
        console.log(err);
        req.flash("registerError", "This email already exists");
        return res.redirect("register");
      });
  },

  forgotPassword: (req, res) => {
    let errorMessage = req.flash("loginError");

    res.render("users/forgot", {
      errorMessage: !lodash.isEmpty(errorMessage) ? errorMessage : false,
      csrfToken: req.csrfToken(),
    });
  },

  forgotPasswordSubmit: async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("users/forgot", {
        errorMessage: errors.array()[0].msg,
        csrfToken: req.csrfToken(),
      });
    }

    let email = req.body.email;

    result = await UserModel.findAll({
      where: {
        email: email,
      },
      raw: true,
    });

    if (lodash.isEmpty(result)) {
      req.flash("loginError", "Provided email is not regisreted");
      return res.redirect("/forgot");
    } else {
      const resetLink = req.hostname + "/reset/" + cryptr.encrypt(email);

      email
        .send({
          template: "forgot",
          message: {
            to: email,
          },
          locals: {
            resetLink: resetLink,
          },
        })
        .then(console.log)
        .catch(console.error);
    }
    res.render("users/forgot", {
      errorMessage: !lodash.isEmpty(errorMessage) ? errorMessage : false,
      csrfToken: req.csrfToken(),
    });
  },
};
