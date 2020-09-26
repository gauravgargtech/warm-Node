const { check } = require("express-validator");
const commonLogin = require("../common/login");
const accountController = require("../controllers/account");

module.exports = (app) => {
  app.get("/account", commonLogin.checkAuth, accountController.account);

  app.post("/account/populate_states", accountController.populateStates);
  app.post("/account/populate_city", accountController.populateCities);

  app.post(
    "/account",
    commonLogin.checkAuth,
    check("first_name")
      .exists()
      .notEmpty()
      .withMessage("First name cannot be black"),
    check("last_name")
      .exists()
      .notEmpty()
      .withMessage("Last name cannot be blank"),
    accountController.saveAccount
  );

  app.get("/reminder", commonLogin.checkAuth, accountController.getReminder);
  app.post("/reminder", commonLogin.checkAuth, accountController.setReminder);

  app.get(
    "/account/populate_states",
    accountController.populateStates
  );
  app.get(
    "/account/populate_cities",
    accountController.populateCities
  );
};
