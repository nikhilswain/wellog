const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;

// load user Modle to find the user
const User = require('../models/User')


// will use a function here so that the passport module can be passed here directly instead requiring the module in both the files (this one and in the app.js)
module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // matching the user from the database
      User
        .findOne({ email: email }) // can use different approach as given in the passport documentation resoving via promise is kinda easy
        .then((user) => {
          if (!user) {
            return done(null, false, { message: 'email not found' });
          }

          //   match passowrd using bcryptjs compare method
          bcryptjs.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            //   if password matchs with the user saved password in the db
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'incorrect password' });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
