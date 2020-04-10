module.exports = {
  auth: function(req, res, next) {
    if(req.isAuthenticated()) {
      console.log('authorized')
      return next();
    }
    console.log('not authorized');
  }
}