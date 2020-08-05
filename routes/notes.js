const notesController = require("../controllers/notes");

module.exports = (app) => {
  app.get("/notes", notesController.getNotes);

  app.get("/notes/add", notesController.addNote);

  app.get("/notes/add/:noteid", notesController.addNote);

  app.post("/notes/add", notesController.insertNote);

  app.get('/notes/delete/:noteid', notesController.deleteNote);

};
