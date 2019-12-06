const bcrypt = require('bcryptjs')
const helpers = require('../_helpers.js')
const db = require('../models')
const { User, Tweet, Reply, Followship, Like } = db


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

  follow: async (req, res, next) => {
    const user = helpers.getUser(req)
    const targetId = +req.body.id
    if (user.id === targetId) return res.redirect('back')

    try {
      await Followship.create({
        followerId: user.id,
        followingId: targetId
      })

      res.redirect('back')

    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  unfollow: async (req, res) => {
    const user = helpers.getUser(req)

    try {
      const followship = await Followship.findOne({
        where: {
          followerId: user.id,
          followingId: req.params.followingId
        }
      })

      await followship.destroy()
      res.redirect('back')

    } catch (err) {
      console.log(err.toString())
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  getUser: async (req, res) => {
    const reqUser = helpers.getUser(req)
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
        tweet.time = tweet.createdAt.toLocaleTimeString().slice(0, -6)
        tweet.countReplies = tweet.Replies.length
        tweet.countLikes = tweet.LikedUsers.length
        tweet.isLiked = tweet.LikedUsers.some(likedUser => reqUser.id === likedUser.id)
      });

      return res.render('user', { showedUser, tweets })
    }
    catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  getLikes: async (req, res) => {
    const reqUser = helpers.getUser(req)
    try {
      const showedUser = await User.findByPk(req.params.id, {
        include: [
          Tweet, 'Followers', 'Followings',
          { association: 'LikedTweets', include: [User, Reply, 'LikedUsers'] }
        ],
        order: [['LikedTweets', Like, 'id', 'DESC']]
      })

      // 頁面 user 資訊
      showedUser.isFollowing = reqUser.Followings.some(following => showedUser.id === following.id)
      showedUser.isSelf = (showedUser.id === reqUser.id)

      // 頁面 like 推文資訊
      const showedTweet = showedUser.LikedTweets
      showedTweet.forEach(tweet => {
        tweet.date = tweet.createdAt.toLocaleDateString()
        tweet.time = tweet.createdAt.toLocaleTimeString().slice(0, -6)
        tweet.countReplies = tweet.Replies.length
        tweet.countLikes = tweet.LikedUsers.length
        tweet.isLiked = tweet.LikedUsers.some(likedUser => reqUser.id === likedUser.id)
      })

      return res.render('userLikes', { showedUser, showedTweet })

    }
    catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}
