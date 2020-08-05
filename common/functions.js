//const sequelize = require('sequelize');
const sequelize = require("../adapters/mysql");
const countryModel = require("../models/countries")(sequelize);
const stateModel = require("../models/states")(sequelize);
const cityModel = require("../models/cities")(sequelize);
const notesModel = require("../models/notes")(sequelize);
const ContactModel = require("../models/contacts")(sequelize);
const NoteContactModel = require("../models/notes_contacts")(sequelize);

module.exports = {
  getCountries: () => {
    return countryModel.findAll();
  },

  getStates: (countryId = null) => {
    return stateModel.findAll({
      where: {
        country_id: countryId,
      },
    });
  },
  getCities: (stateId = null) => {
    return cityModel.findAll({
      where: {
        state_id: stateId,
      },
    });
  },

  getNotes: (userId) => {
    return notesModel.findAll({
      where: {
        user_id: userId,
        status: 1,
      },
    });
  },

  getUserContacts: (userId) => {
    return ContactModel.findAll({
      where: {
        user_id: userId,
        status: 1,
      },
    });
  },

  getNotesContacts: (noteId) => {
    ContactModel.hasOne(NoteContactModel, {
      foreignKey: "contact_id",
    });
    NoteContactModel.belongsTo(ContactModel, {
      foreignKey: "contact_id",
    });

    return NoteContactModel.findAll({
      where: {
        note_id: noteId,
      },
    });
  },

  getNoteById: (noteId) => {
    return notesModel.findByPk(noteId);
  },

  deleteNoteById: (noteId) => {
    return notesModel.update(
      {
        status: 0,
      },
      {
        where: {
          id: noteId,
        },
      }
    );
  },

  getContactIdByName: (name) => {
    ContactModel.findAll({
      where: {
        name: name,
      },
    }).then((result) => {
      return result[0].id;
    });
  },
};
