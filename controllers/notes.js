const functions = require("../common/functions");
const striptags = require("striptags");
const sequelize = require("../adapters/mysql");
const notesModel = require("../models/notes")(sequelize);
const ContactModel = require("../models/contacts")(sequelize);
const NoteContactsModel = require("../models/notes_contacts")(sequelize);
const lodash = require("lodash");

const noteTypes = [
  "Financial Note",
  "Gooddbye to Wifey",
  "Goodbye to Hubby",
  "Goodbye to Kids",
  "Goodbye to Family",
  "Thanking Colleagues",
  "Goodbye to Friends",
  "Other",
];

module.exports = {
  getNotes: async (req, res) => {
    let userId = 2; // req.session.userId;
    let notes = await functions.getNotes(userId);
    let errorMessage = req.flash("noteDelete");

    return res.render("notes/index", {
      notes: notes,
      noteTypes: noteTypes,
      errorMessage: !lodash.isEmpty(errorMessage) ? errorMessage : "",
    });
  },

  addNote: async (req, res) => {
    let noteId = req.params.noteid;

    let userId = 2; // req.session.userId;
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
    });
  },

  insertNote: async (req, res) => {
    let userId = 2; //req.session.userId;

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
};
