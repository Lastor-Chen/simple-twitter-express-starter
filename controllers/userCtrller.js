const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Tweet, Reply } = db

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

  getUser: async (req, res) => {
    try {
      const showedUser = await User.findByPk(req.params.id, {
        include: [
          'LikedTweets', 'Followers', 'Followings',
          { model: Tweet, include: [Reply, 'LikedUsers'] },
        ],
        order: [[Tweet, 'id', 'DESC']]
      })

      const tweets = showedUser.Tweets
      tweets.forEach(tweet => {
        tweet.date = tweet.createdAt.toLocaleDateString()
        tweet.time = tweet.createdAt.toLocaleTimeString().slice(0, -3)
        tweet.countReplies = tweet.Replies.length
        tweet.countLikes = tweet.LikedUsers.length
        tweet.isLiked = tweet.LikedUsers.some(likedUser => req.user.id === likedUser.id)
      });

      return res.render('user', { showedUser, tweets })
    }
    catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}
