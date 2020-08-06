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

var app = express();

//const csrfProtection = csrf();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use(cookieParser());
app.use(ejsLayouts);
app.use(helmet());
//app.use(compression());
//app.use(minify());
app.use(express.static(__dirname + "/public"));

/*
app.use(minify({
  cache: true,
  uglifyJsModule: null,
  errorHandler: null,
  jsMatch: /js/,
  cssMatch: /css/,
  jsonMatch: /json/,
  sassMatch: /scss/,
  lessMatch: /less/,
  stylusMatch: /css/,
  coffeeScriptMatch: /coffeescript/,
}));
*/

//app.use(csrfProtection);

var store = new mongoSession({
  uri:
    "mongodb+srv://gaurav:gaurav@emaily.1vibt.mongodb.net/emaily?retryWrites=true&w=majority",
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

app.use(flash());

app.use((req, res, next) => {
  res.locals = {
    isUser: req.session.userId,
    websiteTitle: "Warmnotes - everyone deserves a chance to say Goodbye",
  };
  next();
});

/*
app.use(
  cookieSession({
    name: "session",
    keys: ["8fhgjhjgjgjh687", "jgjj2"],
  })
);
*/

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

//const indexer = require("./routes/index");

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
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
