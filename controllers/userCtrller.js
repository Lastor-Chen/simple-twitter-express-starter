const bcrypt = require('bcryptjs')
const db = require('../models')
const helpers = require('../_helpers')

const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const User = db.User

// custom module
const { checkSignUp } = require('../lib/checker.js')

module.exports = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: async (req, res) => {
    try {
      const input = { ...req.body }  // 深拷貝，保護原始資料

      // check input
      const error = await checkSignUp(input)
      if (error) return res.render('signup', { error, input })

      input.avatar = 'https://i.imgur.com/Dg08MC8.png'
      input.password = bcrypt.hashSync(input.password, 10)
      await User.create(input)

      req.flash('success', '已成功註冊帳號')
      res.redirect('/signin')

    } catch (err) {
      console.error(err.toString())
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (passport, req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/tweets',
      successFlash: true,
      failureRedirect: '/signin',
      failureFlash: true,
      badRequestMessage: '請輸入 Email 與 Passport'
    })(req, res, next)
  },

  logout: (req, res) => {
    req.flash('success', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  editPage: (req, res) => {
    let user = helpers.getUser(req)
    return User.findByPk(req.params.id)
      .then(userResult => {
        if (userResult.id !== user.id) {
          req.flash('error', '別人的資訊只能用看的喔！')
          res.redirect(`/users/${req.params.id}`)
        } else {
          return res.render('edit', { userResult })
        }
      })
  },

  postProfile: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error', "請填寫名稱")
        return res.redirect('back')
      }

      const input = { ...req.body }
      const { file } = req

      if (file) {
        imgur.setClientId(IMGUR_CLIENT_ID)
        input.avatar = (await imgur.uploadFile(file.path)).data.link
      }

      const user = await User.findByPk(req.params.id)
      user.update(input)

      req.flash('success', '已更新使用者資訊')
      res.redirect(`/users/${user.id}`)

    } catch (err) {
      console.error(err)
    }

  }
}
