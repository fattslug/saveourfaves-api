const User = require('../src/schema/user.schema');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const BearerStrategy = require('passport-http-bearer');

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy({
      clientID: '409743961271-ao8ca9smnl4tieb9k04hg0lli00fmmcd.apps.googleusercontent.com',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`
    },
    function (accessToken, refreshToken, profile, done) {
      var userData = {
        UserID: profile.id,
        Email: profile.emails[0].value,
        Name: profile.displayName,
        Token: accessToken
      };
      done(null, userData);
    }
  )
);

passport.use(new BearerStrategy(
  function(token, done) {
    User.findOne({ Token: token }, function (err, user) {
      // console.log(user);
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user);
    });
  }
));