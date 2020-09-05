const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const commonLogin = require("../../common/login");
const _ = require("lodash");
const config = require("../../config/keys");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleKeys.clientId,
      clientSecret: config.googleKeys.clientSecret,
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
