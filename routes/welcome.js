const express = require('express');
const path = require('path');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// welcome route
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '../../views/welcome.html'));
});

// dashboard  route (after login will redirect here )
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', {
    name: req.user.username,
  });
});
module.exports = router;
