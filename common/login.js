const _ = require("lodash");
const sequelize = require("../adapters/mysql");
//const { result } = require("lodash");
const UserModel = require("../models/users")(sequelize);
const md5 = require("md5");

module.exports = {
  setLogin: (result, req, res) => {
    if (_.isEmpty(result)) {
      req.flash("loginError", "Either email or password is wrong");
      return res.redirect("/login");
    } else {
      console.log(typeof result);
      req.session.userId = result[0].id;
      return res.redirect("/");
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
    //console.log(req.session.userId);
    if (!req.session.userId) {
      return res.redirect("/login");
    }
    next();
  },
};
