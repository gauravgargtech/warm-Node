var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("./common/logger");
const ejsLayouts = require("express-ejs-layouts");
const helmet = require("helmet");
var minifyHTML = require("express-minify-html");
const session = require("express-session");
const mongoSession = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const csrf = require("csurf");
const passport = require("passport");
const bodyParser = require("body-parser");
const config = require("./config/keys");
var async = require("async");

const router = express.Router();
const passportAdapter = require("./adapters/passportAdapter");

//const app = require("https-localhost")();
const app = express();


function parallel(middlewares) {
  return function (req, res, next) {
    async.each(middlewares, function (mw, cb) {
      mw(req, res, cb);
    }, next);
  };
}

app.use(parallel([
  bodyParser.json(),
  cookieParser(),
  ejsLayouts,
  helmet(),
  flash(),
  passport.initialize(),
  express.static(__dirname + "/public", { maxAge: 31557600 })
]));


;
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

var store = new mongoSession({
  uri:
    config.mongo.scheme +
    "://" +
    config.mongo.username +
    ":" +
    config.mongo.password +
    "@" +
    config.mongo.host +
    "/" +
    config.mongo.database +
    "?retryWrites=true&w=majority",
  collection: "mySessions",
});

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboardjjj",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//app.use(passport.session());

var conditionalCSRF = function (req, res, next) {
  const csrfDisabledRoutes = [
    "/account/populate_states",
    "/account/populate_cities",
  ];
  let needCSRF = !csrfDisabledRoutes.includes(req.url);
  //compute needCSRF here as appropriate based on req.path or whatever
  if (needCSRF) {
    csrf({ cookie: true });
  }
  next();
};

app.use(conditionalCSRF);

app.use(
  minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyHTML: true,
    },
  })
);

app.use((req, res, next) => {
  res.locals = {
    isUser: req.session.userId ? req.session.userId : "",
    websiteTitle: "Warmnotes - everyone deserves a chance to say Goodbye",
    planId: req.session.planId ? req.session.planId : 0,
  };
  logger.info("Url : " + req.originalUrl);
  next();
});

app.use("/", require("./routes/index"));
require("./routes/users")(app);
require("./routes/account")(app);
require("./routes/notes")(app);
require("./routes/contacts")(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  logger.error(req.originalUrl);
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  logger.error("Error occured : ");
  logger.error(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
