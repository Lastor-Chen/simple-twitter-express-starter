const db = require('../models')
const Tweet = db.Tweet
const User = db.User

// custom module
const helpers = require('../_helpers')

module.exports = {
  getTweets: async (req, res) => {
    try {
      const [tweets, users] = await Promise.all([
        Tweet.findAll({
          order: [['id', 'DESC']],  // 最新順
          include: [{ all: true }] }),
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
        tweet.countLikes = tweet.Likes.length
      })

      users.forEach(user => {
        user.isFollowing = req.user.Followings.some(following => user.id === following.id)
        user.isSelf = (user.id === req.user.id)
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
      console.log(err)
      res.status(500).json(err.toString())
    }
  }
}