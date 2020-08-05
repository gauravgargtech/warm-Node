const contactsController = require("../controllers/contacts");
const { check } = require("express-validator");

module.exports = (app) => {
  app.get("/contacts", contactsController.getContacts);

  app.post(
    "/contacts/add",
    check("email").isEmail().withMessage("Please enter a valid email id"),
    check("name").notEmpty().withMessage("Please enter a name"),
    contactsController.addContact
  );
};
