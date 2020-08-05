const sequelize = require("../adapters/mysql");
const UserModel = require("../models/users")(sequelize);
const md5 = require("md5");
const lodash = require("lodash");
const commonLogin = require("../common/login");
const { validationResult } = require("express-validator");
const functions = require("../common/functions");

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

    console.log("then block");
    await commonLogin.setLogin(result, req, res);

    console.log("how this came");

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
    console.log(errorMessage);
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
};
