module.exports = {
  home: (req, res) => {
    console.log(req.session, req.session.userId);
    res.render("index");
  },
  plans: (req, res) => {
    res.render("pages/plans");
  },
  policy: (req, res) => {
    res.render("pages/policy");
  },
  faq: (req, res) => {
    res.render("pages/faq");
  },
  terms: (req, res) => {
    res.render("pages/terms");
  },
  contact: (req, res) => {
    res.render("pages/contact");
  },
};
