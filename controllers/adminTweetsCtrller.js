const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const helpers = require('../_helpers')

module.exports = {
  getTweets: async (req, res) => {
    try {
      const [tweets] = await Promise.all([
        Tweet.findAll({
          order: [['id', 'DESC']],
          include: [{ all: true }]
        })
      ])

      tweets.forEach(tweet => {
        tweet.date = tweet.createdAt.toLocaleDateString()
        tweet.time = tweet.createdAt.toLocaleTimeString().slice(0, -6)
        tweet.shortenDescript = tweet.description.slice(0, 50)
      })

      res.render('admin/tweets', { tweets })

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

  deleteTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)

      if (!tweet) {
        req.flash('error', '沒有該則推文')
        return res.redirect(`/admin/tweets`)
      }

      await tweet.destroy()

      req.flash('success', '已刪除推文')
      res.redirect(`/admin/tweets`)
    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  }
}

