const _ = require("lodash");
const sequelize = require("../adapters/mysql");
const UserModel = require("../models/users")(sequelize);
const md5 = require("md5");

module.exports = {
  setLogin: (result, req, res) => {
    console.log(
      "--------------------------------------------------------------------------"
    );
    if (_.isEmpty(result)) {
      req.flash("loginError", "Either email or password is wrong");
      return res.redirect("/login");
    } else {
      console.log(typeof result);
      req.session.userId = result[0].id;
      req.session.planId = result[0].plan_id;
      return res.redirect("/notes");
    }
  },

  isLoggedIn: (req, res) => {
    if (!_.isEmpty(req.session.userId)) {
      return true;
    } else {
      return false;
    }
  },

  checkUserByEmail: async (email) => {
    let result = await UserModel.findAll({
      where: {
        email: email,
      },
      raw: true,
    });

    return result;
  },

  getUserById: async (userId) => {
    return await UserModel.findByPk(userId);
  },

  registerUser: async (details) => {
    return await UserModel.create({
      first_name: details.first_name,
      last_name: details.last_name,
      email: details.email,
      password: md5(details.password),
    });
  },

  checkAuth: (req, res, next) => {
    const publicUrls = ["/login", "/register"];
    const userUrl = ["/notes"];

    if (!req.session.userId && !publicUrls.includes(req.url)) {
      return res.redirect("/login");
    } else if (req.session.userId && publicUrls.includes(req.url)) {
      return res.redirect("/notes");
    }
    next();
  },
};
