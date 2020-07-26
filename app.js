const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();

// set public folder
app.use('/public', express.static('public'));

// set view engine
app.use(expressLayouts);
app.set('view engine', 'ejs');

// body parser
app.use(express.urlencoded({ extended: false }));

// config passport
require('./config/passport')(passport);

// Express session
app.use(
  session({
    secret: 'chrissy', // doesn't matter what it is
    resave: false,
    saveUninitialized: true,
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// creating local variables of own for different type of msgs like succes or error etc
// syntax : res.locals.variableName
app.use((req, res, next) => {
  res.locals.successMsg = req.flash('successMsg');
  res.locals.errorMsg = req.flash('errorMsg');
  res.locals.error = req.flash('error'); // provided by the flash just creating the global variable for flash error

  next();
});

// MongoDB config
const db = require('./config/connection').MongoURI;

// connecting to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => console.log(err));

// welcome page route
app.use('/', require('./routes/welcome'));

// routes to user registration and login
app.use('/', require('./routes/user'));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`listening to port ${port}`));
