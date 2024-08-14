const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userController = require("../controllers/userController");
const User = require("../model/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userController.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (userToken, tokenSecret, profile, done) => {
      try {
        const user = await userController.createGoogleUser(profile);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);




module.exports = passport;
