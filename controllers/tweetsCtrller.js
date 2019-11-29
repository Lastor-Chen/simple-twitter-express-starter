const db = require('../models')
const Tweet = db.Tweet
const User = db.User

module.exports = {
  getTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll({ order: [['createdAt', 'DESC']] })
      const users = await User.findAll()

      res.render('tweets', { tweets, users })

    } catch (err) {
      console.error(err.toString())
      res.status(500).json(err.toString())
    }
  }
}