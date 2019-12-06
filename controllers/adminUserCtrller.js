const db = require('../models')
const User = db.User

const helpers = require('../_helpers')

module.exports = {
  getUsers: async (req, res) => {
    try {
      let [users] = await Promise.all([
        User.findAll({
          include: [{ all: true }],
          order: [['id', 'DESC']],
        })
      ])

      users = users.map(user => ({
        ...user.dataValues,
        tweetsCount: user.Tweets.length,
      }))

      users = users.sort((a, b) => b.tweetsCount - a.tweetsCount)

      res.render('admin/users', { users })

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  }
}

