const LocalStrategy = require('passport-local').Strategy;
const sha1 = require('sha1');
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // match password
        if(sha1(password)==user.password)
        {
          return done(null, user);
        }
        else{
          return done(null, false, { message: 'Password incorrect' });
        }
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(_id, done) {
    User.findById(_id, function(err, user) {
      done(err, user);
    });
  });
};
