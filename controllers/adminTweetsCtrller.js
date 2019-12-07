const db = require('../models')
const { User, Tweet, Reply } = db

const helpers = require('../_helpers')
const moment = require('moment')

module.exports = {
  getTweets: async (req, res) => {
    try {
      const [tweets] = await Promise.all([
        Tweet.findAll({
          order: [['id', 'DESC']],
          include: [User, { model: Reply, order: [['id', 'ASC']], include: [User] }]
        })
      ])

      tweets.forEach(tweet => {
        tweet.date = moment(tweet.createdAt).format('lll')
        tweet.time = moment(tweet.createdAt).fromNow(false)
        if (tweet.description.length > 50) {
          tweet.shortenDescript = tweet.description.slice(0, 50) + ' ...'
        } else {
          tweet.shortenDescript = tweet.description
        }
        tweet.Replies.forEach(reply => {
          reply.date = moment(reply.createdAt).format('lll')
          reply.time = moment(reply.createdAt).fromNow(false)
        })
      })

      res.render('admin/tweets', { tweets, adminNavbar: true })

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

