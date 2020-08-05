const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const commonLogin = require("../../common/login");
const _ = require("lodash");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "788306346428-sgdiism746raiu6krmbqgqijmicakvv3.apps.googleusercontent.com",
      clientSecret: "djG0K6kbF5G2imllSXNZJBq8",
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      let email = profile.emails[0].value;
      commonLogin.checkUserByEmail(email).then((userDetails) => {
        if (!_.isEmpty(userDetails)) {
          return done(null, userDetails);
        } else {
          commonLogin
            .registerUser({
              first_name: profile.name.givenName,
              last_name: profile.name.familyName,
              email: email,
              password: Math.random().toString(36).substring(4),
            })
            .then((result) => {
              done(null, [result]);
            });
        }
      });
    }
  )
);
