var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const ejsLayouts = require("express-ejs-layouts");
const compression = require("compression");
const helmet = require("helmet");
var minifyHTML = require("express-minify-html");
const mysql = require("./adapters/mysql");
const session = require("express-session");
const mongoSession = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const csrf = require("csurf");
const minify = require("express-minify");
const googleStrategy = require("./adapters/passportAdapter");
const passport = require("passport");
const bodyParser = require("body-parser");
const async = require("async");
const config = require("./config/keys");

var app = express();

//const csrfProtection = csrf();
// view engine setup

function parallel(middleware) {
  return (req, res, next) => {
    async.each(
      middleware,
      (func, cb) => {
        func(req, res, cb);
      },
      next
    );
  };
}
const middlewares = [
  logger("dev"),
  bodyParser.json(),
  bodyParser.urlencoded({
    extended: false,
  }),
  cookieParser(),
  ejsLayouts,
  helmet(),
  flash(),
];

app.use(parallel(middlewares));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(csrfProtection);

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

//app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboardjjj",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  res.locals = {
    isUser: req.session.userId,
    websiteTitle: "Warmnotes - everyone deserves a chance to say Goodbye",
  };
  next();
});

app.use(
  cookieSession({
    name: "session",
    keys: [config.cookieKey],
  })
);

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
      minifyJS: true,
      minifyHTML: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", require("./routes/index"));
require("./routes/users")(app);
require("./routes/account")(app);
require("./routes/notes")(app);
require("./routes/contacts")(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  console.log("-----ERROR  by EXPRESS --------------------------------");
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
