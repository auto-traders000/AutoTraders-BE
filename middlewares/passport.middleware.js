const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const googleUser = require('../database/schemas/googleUser.schema');
const logger = require('winston'); // Import and configure your logger (Winston, in this case)

passport.use(
  new GoogleStrategy(
    {
      clientID: '30380927053-uv9cnajh6t7ne3vfidvos8lagt7jlea1.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'https://8b1a-2400-adc7-2109-8600-6d0e-41cf-5646-c243.ngrok-free.app/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await googleUser.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }
        const newUser = new googleUser({
          googleId: profile.id,
          userName: profile.displayName,
          email: profile.emails,
          profilePicture: profile.photos,
        });
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        // Log the error
        logger.error('OAuth Error:', error);

        // Handle the error as needed
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await googleUser.findById(id);
  done(null, user);
});

module.exports = passport;