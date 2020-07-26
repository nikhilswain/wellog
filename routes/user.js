const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
// userSchema module from models
const User = require('../models/User');
const passport = require('passport');

//signup get request
//there no need to get this '/user/signup' we can directly get the route as '/signup' as in app file i already included the user folder ( see in line 15 ) but i want to show the url as /user/signup or login in ther url bar thats why added it
router.get('/user/signup', (req, res) => {
  res.render('signup');
});

router.get('/user/login', (req, res) => {
  res.render('login');
});

// singup post request handle
router.post('/user/signup', (req, res) => {
  const { username, email, password, cnfpassword } = req.body;
  //will push the methods to the arrya for different errors
  const errors = [];

  //validations
  //for any empty field
  if (!username || !email || !password || !cnfpassword) {
    errors.push({ msg: 'all fields are required' });
  }

  // for passwords match
  if (password !== cnfpassword) {
    errors.push({ msg: 'password do not match' });
  }

  // for password length
  if (password.length < 8) {
    errors.push({ msg: 'password should be at least 8 chars or longer' });
  }

  // checking for errors now
  if (errors.length > 0) {
    //(if validation fails)
    res.render('signup', {
      errors,
      username,
      email,
      password,
      cnfpassword,
    });
  } else {
    //if validation passes
    // cheking if the email is already registered or not
    User.findOne({ email: email }).then((user) => {
      if (user) {
        // this means user already exists
        errors.push({ msg: 'This email has been already registered' });
        res.render('signup', {
          errors,
          username,
          email,
          password,
          cnfpassword,
        });
      } else {
        // saving new user to the data base
        const newUser = new User({
          username,
          email,
          password,
        });
        // hashing the password before saving to db
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // hashed password
            newUser.password = hash;

            // save user into the database
            newUser
              .save()
              .then(() => {
                req.flash('successMsg', 'Account created successfully, You can log in now');
                res.redirect('/user/login');
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// login request
router.post('/user/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/user/login',
    failureFlash: true,
  })(req, res, next);
});

// logout handling
router.get('/user/logout', (req, res) => {
  req.logout(); // provided by the passport
  req.flash('successMsg', 'Successfully logged out'); // creating new success msg for logout
  res.redirect('/user/login');
})


module.exports = router;
