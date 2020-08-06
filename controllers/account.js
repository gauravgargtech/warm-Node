const sequelize = require("../adapters/mysql");
const UserModel = require("../models/users")(sequelize);
const md5 = require("md5");
const lodash = require("lodash");
const commonLogin = require("../common/login");
const { validationResult } = require("express-validator");
const functions = require("../common/functions");

const remindMonths = {
  2: "2 Months",
  3: "3 Months",
  4: "4 Months",
  5: "5 Months",
  6: "6 Months",
};
const forDays = {
  3: "3 Days",
  4: "4 Days",
  5: "5 Days",
  6: "6 Days",
  7: "7 Days",
};

module.exports = {
  account: async (req, res) => {
    userId = req.session.userId;

    console.log(userId);
    var errorMessage = req.flash("accountError");

    let userDetails = await commonLogin.getUserById(userId);

    let countries = await functions.getCountries();

    return res.render("users/account", {
      countries: countries,
      userDetails: userDetails,
      errorMessage: !lodash.isEmpty(errorMessage) ? errorMessage : null,
    });
  },

  populateStates: async (req, res) => {
    let states = await functions.getStates(req.body.country);
    return res.status(200).json(states);
  },

  populateCities: async (req, res) => {
    return res.status(200).json(await functions.getCities(req.body.state));
  },

  saveAccount: (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("accountError", errors.array()[0].msg);
      return res.redirect("/account");
    }

    console.log(req.body);
    UserModel.update(
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        country_id: req.body.country_id,
        phone_number: req.body.phone_number,
        state_id: req.body.state_id,
        city_id: req.body.city_id,
        postcode: req.body.postcode,
        address_1: req.body.address_1,
        address_2: req.body.address_2,
      },
      {
        where: {
          id: req.session.userId,
        },
      }
    )
      .then((result) => {
        console.log(result);
        return res.redirect("/account");
      })
      .catch((err) => {
        console.log(err);
      });
  },

  getReminder: (req, res) => {
    let userId = req.session.userId;

    commonLogin
      .getUserById(userId)
      .then((result) => {
        console.log(result);
        return res.render("users/reminder", {
          userDetails: result,
          remindMonths: remindMonths,
          forDays: forDays,
        });
      })
      .catch((err) => {});
  },

  setReminder: async (req, res) => {
    let userId = req.session.userId;
    await UserModel.update(
      {
        remind_months: req.body.remind_months,
        for_days: req.body.for_days,
      },
      {
        where: {
          id: userId,
        },
      }
    );
    return res.redirect("/reminder");
  },
};
