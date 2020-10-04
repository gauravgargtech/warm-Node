const userController = require("../controllers/users");
const csrf = require("csurf");
const csrfProtestion = csrf({ cookie: true });
const { check } = require("express-validator");
const passport = require("passport");
const commonLogin = require("../common/login");

module.exports = (app) => {
  /* GET users listing. */
  app.get(
    "/login",
    commonLogin.checkAuth,
    csrfProtestion,
    userController.login
  );

  app.post(
    "/login",
    commonLogin.checkAuth,
    csrfProtestion,
    check("email").isEmail().withMessage("Please enter valid email"),
    check("password")
      .isLength({ min: 2, max: 10 })
      .withMessage("Please enter valid password "),
    userController.performLogin
  );

  app.get("/logout", userController.logout);

  app.get(
    "/register",
    commonLogin.checkAuth,
    csrfProtestion,
    userController.register
  );

  app.post(
    "/register",
    commonLogin.checkAuth,
    userController.performRegistration
  );

  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );
  app.get(
    "/auth/google/callback",
    passport.authenticate("twitter", { failureRedirect: "/login" }),
    async function (req, res) {
      await commonLogin.setLogin(req.user, req, res);
      res.redirect("/");
    }
  );

  app.get("/auth/twitter", passport.authenticate("twitter"));
  app.get(
    "/auth/twitter/callback",
    passport.authenticate("twitter", { failureRedirect: "/login" }),
    async function (req, res) {
      await commonLogin.setLogin(req.user, req, res);
      res.redirect("/");
    }
  );

  app.get(
    "/auth/facebook",
    passport.authenticate("facebook", {
      scope: ["email"],
    })
  );

  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    async function (req, res) {
      await commonLogin.setLogin(req.user, req, res);
      res.redirect("/");
    }
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      commonLogin.setLogin(req.user, req, res);
    }
  );

  app.get(
    "/forgot",
    commonLogin.checkAuth,
    csrfProtestion,
    userController.forgotPassword
  );

  app.post(
    "/forgot",
    commonLogin.checkAuth,
    check("email").isEmail().withMessage("Please enter valid email"),
    csrfProtestion,
    userController.forgotPasswordSubmit
  );

};
