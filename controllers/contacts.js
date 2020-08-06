const functions = require("../common/functions");
const striptags = require("striptags");
const sequelize = require("../adapters/mysql");
const notesModel = require("../models/notes")(sequelize);
const ContactModel = require("../models/contacts")(sequelize);
const lodash = require("lodash");
const { validationResult } = require("express-validator");

const relations = {
  wife: "Wife",
  son: "Son",
  daughter: "Daughter",
  friend: "Friend",
  colleague: "Colleague",
  cousin: "Cousin",
  father_in_law: "Father-in-law",
  mother_in_law: "Mother-in-law",
};

module.exports = {
  getContacts: async (req, res) => {
    let userId = req.session.userId;
    let userContacts = await functions.getUserContacts(userId);
    let message = req.flash("contactCreated");

    return res.render("contacts/index", {
      allContacts: userContacts,
      relations: relations,
      errorMessage: message,
    });
  },

  addContact: async (req, res) => {
    let userId = req.session.userId;

    let errors = validationResult(req);

    if (!lodash.isEmpty(errors)) {
      req.flash("contactCreated", errors.array()[0].msg);
      return res.redirect("/contacts");
    }

    await ContactModel.create({
      user_id: userId,
      name: req.body.name,
      email: req.body.email,
      color: "#" + Math.random().toString(16).substr(-6),
      relation: req.body.relation,
      status: 1,
      created_at: Date.now(),
    });

    req.flash("contactCreated", "Contact is created successfully!");

    return res.redirect("/contacts");
  },

  insertNote: (req, res) => {
    let userId = req.session.userId;

    if (req.body.note_id) {
      notesModel
        .update(
          {
            note_type: req.body.note_type,
            title: req.body.title,
            description: req.body.note,
          },
          {
            where: {
              id: req.body.note_id,
            },
          }
        )
        .then((result) => {
          console.log(result);
          return res.redirect("/notes");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      notesModel
        .create({
          note_type: req.body.note_type,
          title: req.body.title,
          description: req.body.note,
          user_id: userId,
          status: 1,
          created_at: Date.now(),
        })
        .then((result) => {
          console.log(result);
          return res.redirect("/notes");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },

  deleteNote: async (req, res) => {
    let noteId = req.params.noteid;
    await functions.deleteNoteById(noteId);

    req.flash("noteDelete", "Note is deleted successfully!");
    return res.redirect("/notes");
  },
};
