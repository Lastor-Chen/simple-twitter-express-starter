const helpers = require('../_helpers')

module.exports = {
  isAuth: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  },

  isAdminAuth: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (req.user.role === 'Admin') { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

}

