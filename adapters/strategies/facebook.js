const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
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
  new FacebookStrategy(
    {
      clientID: config.facebookKeys.clientId,
      clientSecret: config.facebookKeys.clientSecret,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "emails", "name"],
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      let email = "";
      try {
        email = profile.emails[0].value;
      } catch (error) {
        email = `${profile.id}@facebook.f`;
      }

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
