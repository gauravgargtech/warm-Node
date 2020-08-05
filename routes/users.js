const userController = require("../controllers/users");
const csrf = require("csurf");
const csrfProtestion = csrf({ cookie: true });
const { check } = require("express-validator");
const passport = require("passport");
const commonLogin = require("../common/login");

module.exports = (app) => {
  /* GET users listing. */
  app.get("/login", csrfProtestion, userController.login);

  app.post(
    "/login",
    csrfProtestion,
    check("email").isEmail().withMessage("Please enter valid email"),
    check("password")
      .isLength({ min: 2, max: 10 })
      .withMessage("Please enter valid password "),
    userController.performLogin
  );

  app.get("/logout", userController.logout);

  app.get("/register", csrfProtestion, userController.register);

  app.post("/register", userController.performRegistration);

  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      commonLogin.setLogin(req.user, req, res);
    }
  );
};
