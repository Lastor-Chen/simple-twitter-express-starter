const db = require('../models')
const { Tweet, User, Reply } = db

module.exports = {
  getTweets: async (req, res) => {
    try {
      const [tweets, users] = await Promise.all([
        Tweet.findAll({
          order: [['id', 'DESC']],  // 最新順
          include: [{ all: true }]
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
    try {
      const showedTweet = await Tweet.findByPk(req.params.tweet_id, {
        include: [User, 'LikedUsers',
          {
            model: Reply, include: [User],
            order: [[Reply, 'id', 'DESC']]
          }],
      })

      const showedUser = await User.findByPk(showedTweet.UserId, {
        include: [Tweet, 'Followings', 'Followers', 'LikedTweets']
      })

      // 頁面 Tweets 資訊
      showedTweet.date = showedTweet.createdAt.toLocaleDateString()
      showedTweet.time = showedTweet.createdAt.toLocaleTimeString().slice(0, -3)
      showedTweet.countReplies = showedTweet.Replies.length
      showedTweet.countLikes = showedTweet.LikedUsers.length
      showedTweet.isLiked = showedTweet.LikedUsers.some(likedUser => req.user.id === likedUser.id)

      // 頁面 Replies 資訊
      const replies = showedTweet.Replies
      replies.forEach(reply => {
        reply.date = reply.createdAt.toLocaleDateString()
        reply.time = reply.createdAt.toLocaleTimeString().slice(0, -3)
      })

      res.render('tweet', { showedTweet, showedUser, replies })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}