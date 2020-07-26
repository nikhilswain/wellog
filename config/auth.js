// this file module will work as a auth guard means if after logout user will go back he has to login again to see the content
module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('errorMsg', 'Please login to view the content');
    res.redirect('/user/login')
  },
};
