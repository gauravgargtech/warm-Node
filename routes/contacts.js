const contactsController = require("../controllers/contacts");
const { check } = require("express-validator");
const commonLogin = require("../common/login");

module.exports = (app) => {
  app.get("/contacts", commonLogin.checkAuth, contactsController.getContacts);

  app.post(
    "/contacts/add",
    commonLogin.checkAuth,
    check("email").isEmail().withMessage("Please enter a valid email id"),
    check("name").notEmpty().withMessage("Please enter a name"),
    contactsController.addContact
  );
};
