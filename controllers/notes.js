const functions = require("../common/functions");
const striptags = require("striptags");
const sequelize = require("../adapters/mysql");
const notesModel = require("../models/notes")(sequelize);
const ContactModel = require("../models/contacts")(sequelize);
const NoteContactsModel = require("../models/notes_contacts")(sequelize);
const lodash = require("lodash");
const email = require("../adapters/mailer");
const path = require("path");

const noteTypes = [
  "Financial Note",
  "Note to Wifey",
  "Note to Hubby",
  "Note to Kids",
  "Note to Family",
  "Note Colleagues",
  "Note to Friends",
  "Other",
];

module.exports = {
  getNotes: async (req, res) => {
    let userId = req.session.userId;
    let notes = await functions.getNotes(userId);
    let errorMessage = req.flash("noteDelete");

    return res.render("notes/index", {
      notes: notes,
      noteTypes: noteTypes,
      tab: "notes",
      errorMessage: !lodash.isEmpty(errorMessage) ? errorMessage : "",
    });
  },

  addNote: async (req, res) => {
    let noteId = req.params.noteid;

    let userId = req.session.userId;
    let userContacts = await functions.getUserContacts(userId);

    let notesContacts, noteDetails;
    if (noteId) {
      notesContacts = await functions.getNotesContacts(noteId);
      console.log(notesContacts);
      noteDetails = await functions.getNoteById(noteId);
    }

    return res.render("notes/addnote", {
      noteTypes: noteTypes,
      userContacts: userContacts.map((item) => {
        return {
          text: item.name,
          weight: Math.floor(Math.random() * 10 + 1),
        };
      }),
      notesContacts: notesContacts,
      noteDetails: noteDetails,
      tab: "notes",
    });
  },

  insertNote: async (req, res) => {
    let userId = req.session.userId;

    let noteId;

    if (req.body.note_id) {
      noteId = req.body.note_id;
      await notesModel.update(
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
      );
    } else {
      let newNote = await notesModel.create({
        note_type: req.body.note_type,
        title: req.body.title,
        description: req.body.note,
        user_id: userId,
        status: 1,
        created_at: Date.now(),
      });

      noteId = newNote.dataValues.id;
    }

    if (!lodash.isEmpty(req.body.contact)) {
      let chosenContacts = req.body.contact.split(",");

      await NoteContactsModel.destroy({
        where: {
          note_id: noteId,
        },
      });

      for (item in chosenContacts) {
        contactId = 1; //functions.getContactIdByName(chosenContacts[item]);
        await NoteContactsModel.create({
          note_id: noteId,
          user_id: userId,
          contact_id: contactId,
          created_at: Date.now(),
        });
      }
    }
    return res.redirect("/notes");
  },

  deleteNote: async (req, res) => {
    let noteId = req.params.noteid;
    await functions.deleteNoteById(noteId);

    req.flash("noteDelete", "Note is deleted successfully!");
    return res.redirect("/notes");
  },

  emailNote: async (req, res) => {
    let noteId = req.params.noteid;

    let noteDetails = await functions.getNoteById(noteId);

    let userDetails = await functions.getUserById(req.session.userId);

    await email.send({
      template: "email_send",
      message: {
        to: userDetails.email,
      },
      locals: {
        name: userDetails.first_name + " " + userDetails.last_name,
        content: noteDetails.description,
        subject: "Warmnotes : " + striptags(noteDetails.title),
        unsubscribeUrl: "",
      },
    });

    req.flash("noteDelete", "Note is emailed to you successfully!");
    return res.redirect("/notes");
  },
};
