const passport = require("passport");
const TwitterStrategy = require("passport-twitter");
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
  new TwitterStrategy(
    {
      consumerKey: config.twitterKeys.consumerKey,
      consumerSecret: config.twitterKeys.consumerSecret,
      callbackURL: config.domain+"/auth/twitter/callback",
    },
    function (token, tokenSecret, profile, done) {
      let email = `${profile.id}@twitter@twitter.c`;
      let names = profile.displayName.split(" ");

      commonLogin.checkUserByEmail(email).then((userDetails) => {
        if (!_.isEmpty(userDetails)) {
          return done(null, userDetails);
        } else {
          commonLogin
            .registerUser({
              first_name: names[0],
              last_name: _.isEmpty(names[1]) ? "" : names[1],
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
