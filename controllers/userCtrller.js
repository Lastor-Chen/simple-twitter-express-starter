const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User

module.exports = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res) => {
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
      introduction: req.body.introduction
    }).then(user => {
      res.redirect('/signin')
    })
  }
}
