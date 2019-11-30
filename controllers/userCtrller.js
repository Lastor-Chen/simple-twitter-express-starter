const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

module.exports = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼不一致，請重新檢查')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱已被其他使用者註冊')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
            introduction: req.body.introduction
          }).then(user => {
            req.flash('success_messages', '已成功註冊帳號')
            return res.redirect('/signin')
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success', '成功登入！')
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}
