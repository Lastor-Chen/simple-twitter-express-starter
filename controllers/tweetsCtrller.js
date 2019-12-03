const db = require('../models')
const { Tweet, User, Like } = db

// custom module
const helpers = require('../_helpers.js')

module.exports = {
  getTweets: async (req, res) => {
    try {
      const [tweets, users] = await Promise.all([
        Tweet.findAll({
          order: [['id', 'DESC']],  // 最新順
          include: [{ all: true }] }),
        User.findAll({ 
          order: [['id', 'ASC']],
          include: [{ all: true }]
        })
      ]) 

      // 頁面 Date 資訊
      tweets.forEach(tweet => {
        tweet.date = tweet.createdAt.toLocaleDateString()
        tweet.time = tweet.createdAt.toLocaleTimeString().slice(0, -6)
        tweet.countReplies = tweet.Replies.length
        tweet.countLikes = tweet.Likes.length
      })

      res.render('tweets', { tweets, users })

    } catch (err) {
      console.error(err.toString())
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