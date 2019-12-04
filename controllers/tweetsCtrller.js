const db = require('../models')
const Tweet = db.Tweet
const User = db.User

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

      res.render('tweets', { tweets, users })

    } catch (err) {
      console.error(err.toString())
      res.status(500).json(err.toString())
    }
  },
  getTweet: async (req, res) => {
    res.render('tweet')
  }
}