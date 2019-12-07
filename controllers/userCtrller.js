const bcrypt = require('bcryptjs')
const helpers = require('../_helpers.js')
const db = require('../models')
const { User, Tweet, Reply, Followship, Like } = db
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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
      console.error(err)
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

  follow: async (req, res) => {
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
      await Followship.destroy({
        where: {
          followerId: user.id,
          followingId: +req.params.followingId
        }
      })

      res.redirect('back')

    } catch (err) {
      console.log(err.toString())
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  getUserTweets: async (req, res) => {
    try {
      const user = helpers.getUser(req)
      const showedUser = await User.findByPk(req.params.id, {
        include: [
          'LikedTweets', 'Followers', 'Followings',
          { model: Tweet, include: [Reply, 'LikedUsers'] },
        ],
        order: [[Tweet, 'id', 'DESC']]
      })

      // 製作頁面資料
      const tweets = showedUser.Tweets
      tweets.forEach(tweet => {
        tweet.date = tweet.createdAt.toLocaleDateString()
        tweet.time = tweet.createdAt.toLocaleTimeString().slice(0, -6)
        tweet.countReplies = tweet.Replies.length
        tweet.countLikes = tweet.LikedUsers.length
        tweet.isLiked = tweet.LikedUsers.some(likedUser => user.id === likedUser.id)
      });

      // Following 判斷
      const isFollowing = user.Followings.some(following => following.id === showedUser.id)

      return res.render('userTweets', { showedUser, tweets, isFollowing })
    }
    catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  editPage: async (req, res) => {
    try {
      const user = helpers.getUser(req)
      if (+req.params.id !== user.id) {
        req.flash('error', '別人的資訊只能用看的喔！')
        return res.redirect(`/users/${user.id}/edit`)
      }

      res.render('edit')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  postProfile: async (req, res) => {
    try {
      const user = helpers.getUser(req)
      const targetId = +req.params.id
      const input = { ...req.body }

      // 檢查 input 與 user
      if (user.id !== targetId) return res.render('edit', { error: '只能改自己的資料喔！' })
      if (!input.name) return res.render('edit', { error: '請填寫名稱' })

      // 圖片上傳
      const { file } = req
      if (file) {
        imgur.setClientId(IMGUR_CLIENT_ID)
        input.avatar = (await imgur.uploadFile(file.path)).data.link
      }

      // 更新 user profile
      const newUser = await User.findByPk(targetId)
      newUser.update(input)

      req.flash('success', '已更新使用者資訊')
      res.redirect(`/users/${user.id}/tweets`)
    } catch(err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  getFollowings: async (req, res) => {
    try {
      const user = helpers.getUser(req)
      const showedUser = await User.findByPk(req.params.id, {
        include: [
          // tweets 只用做記數，僅包入 id 來輕量化
          { model: Tweet, attributes: ['id'] }, 
          'Followings', 'Followers', 'LikedTweets'
        ],
        // 排序 Followings 藉由 Followship 的 id (最新順)
        order: [['Followings', Followship, 'id', 'DESC']]
      })

      // 製作頁面資料
      showedUser.isSelf = (user.id === showedUser.id)
      showedUser.isFollowing = user.Followings.some(following => following.id === showedUser.id)
      
      const followings = showedUser.Followings
      followings.forEach(following => {
        following.isFollowing = user.Followings.some(selfFollowing => selfFollowing.id === following.id)
        following.isSelf = (following.id === user.id)
      })

      res.render('userFollowings', { css: 'userFollowings', showedUser, followings })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },
  
  getLikes: async (req, res) => {
    const user = helpers.getUser(req)
    try {
      const showedUser = await User.findByPk(req.params.id, {
        include: [
          Tweet, 'Followers', 'Followings',
          { association: 'LikedTweets', include: [User, Reply, 'LikedUsers'] }
        ],
        order: [['LikedTweets', Like, 'id', 'DESC']]
      })

      // 頁面 user 資訊
      showedUser.isFollowing = user.Followings.some(following => showedUser.id === following.id)
      showedUser.isSelf = (showedUser.id === user.id)

      // 頁面 like 推文資訊
      const showedTweet = showedUser.LikedTweets
      showedTweet.forEach(tweet => {
        tweet.date = tweet.createdAt.toLocaleDateString()
        tweet.time = tweet.createdAt.toLocaleTimeString().slice(0, -6)
        tweet.countReplies = tweet.Replies.length
        tweet.countLikes = tweet.LikedUsers.length
        tweet.isLiked = tweet.LikedUsers.some(likedUser => user.id === likedUser.id)
      })

      return res.render('userLikes', { showedUser, showedTweet })

    }
    catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  getFollowers: async (req, res) => {
    try {
      const user = helpers.getUser(req)
      const showedUser = await User.findByPk(req.params.id, {
        include: [
          'Followers',
          // tweets 只用做記數，僅包入 id 來輕量化
          { model: Tweet, attributes: ['id'] },
          { association: 'Followings', attributes: ['id'] },
          { association: 'LikedTweets', attributes: ['id'] }
        ],
        // 排序 Followings 藉由 Followship 的 id (最新順)
        order: [['Followers', Followship, 'id', 'DESC']]
      })

      // 製作頁面資料
      showedUser.isSelf = (user.id === showedUser.id)
      showedUser.isFollowing = user.Followings.some(following => following.id === showedUser.id)

      const followers = showedUser.Followers
      followers.forEach(follower => {
        follower.isFollowing = user.Followings.some(following => following.id === follower.id)
        follower.isSelf = (user.id === follower.id)
      })

      res.render('userFollowers', { css: 'userFollowers', showedUser, followers })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },
}
