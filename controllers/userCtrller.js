const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

module.exports = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error', '兩次密碼不一致，請重新檢查')
      return res.redirect('/signup')
    }
    User.findOne({ where: { email: req.body.email } }).then(user => {
      if (user) {
        req.flash('error', '信箱已被其他使用者註冊')
        return res.redirect('/signup')
      }

      const input = { ...req.body }  // 深拷貝，保護原始資料
      input.password = bcrypt.hashSync(input.password, bcrypt.genSaltSync(10), null)
      User.create(input)
        .then(user => {
          req.flash('success', '已成功註冊帳號')
          return res.redirect('/signin')
        })
        .catch(err => {
          console.error(err.toString())
          res.status(500).json({ status: 'serverError', message: err.toString() })
        })
    })
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
