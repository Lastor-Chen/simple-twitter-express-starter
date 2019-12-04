const db = require('../models')
const { Tweet, User, Like } = db

// custom module
const helpers = require('../_helpers.js')

module.exports = {
  getTweets: async (req, res) => {
    try {
      const reqUser = helpers.getUser(req)
      const [tweets, users] = await Promise.all([
        Tweet.findAll({
          order: [['id', 'DESC']],  // 最新順
          include: [{ all: true, nested: false }] 
        }),
        User.findAll({ 
          order: [['id', 'ASC']],
          include: 'Followers'
        })
      ]) 

      // 頁面 Date 資訊
      tweets.forEach(tweet => {
        tweet.date = tweet.createdAt.toLocaleDateString()
        tweet.time = tweet.createdAt.toLocaleTimeString().slice(0, -6)
        tweet.countReplies = tweet.Replies.length
        tweet.countLikes = tweet.LikedUsers.length
        tweet.isLike = reqUser.LikedTweets.some(like => tweet.id === like.id)
      })

      users.forEach(user => {
        user.isFollowing = reqUser.Followings.some(following => user.id === following.id)
        user.isSelf = (user.id === reqUser.id)
      })

      // POST tweet 失敗時，保留內文
      const history = req.flash('description')

      res.render('tweets', { tweets, users, history })

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

  postTweet: async (req , res) => {
    try {
      const user = helpers.getUser(req)
      const { description } = req.body

      if (!description) {
        req.flash('error', '請輸入內文')
        return res.redirect('/tweets')
      }

      if (description.length > 140) {
        req.flash('error', '不得超過 140 字')
        req.flash('description', description)
        return res.redirect('/tweets')
      } 

      await Tweet.create({
        UserId: user.id,
        description
      })

      req.flash('success', '發送成功')
      res.redirect('/tweets')

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

  like: async (req, res) => {
    try {
      const user = helpers.getUser(req)
      await Like.create({ 
        UserId: user.id, 
        TweetId: req.params.id
      })

      res.redirect('back')

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },
  
  unlike: async (req, res) => {
    try {
      const user = helpers.getUser(req)
      const like = await Like.findOne({
        where: {
          UserId: user.id,
          TweetId: req.params.id
        }
      })

      await like.destroy()
      res.redirect('back')

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  }
}