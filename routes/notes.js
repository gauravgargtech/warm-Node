const notesController = require("../controllers/notes");
const commonLogin = require("../common/login");

module.exports = (app) => {
  app.get("/notes", commonLogin.checkAuth, notesController.getNotes);

  app.get("/notes/add", commonLogin.checkAuth, notesController.addNote);

  app.get("/notes/add/:noteid", commonLogin.checkAuth, notesController.addNote);

  app.post("/notes/add", commonLogin.checkAuth, notesController.insertNote);

  app.get(
    "/notes/delete/:noteid",
    commonLogin.checkAuth,
    notesController.deleteNote
  );
  app.get(
    "/notes/email/:noteid",
    commonLogin.checkAuth,
    notesController.emailNote
  );
};
