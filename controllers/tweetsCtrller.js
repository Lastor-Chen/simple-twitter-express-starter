const db = require('../models')
const { Tweet, User, Like, Reply } = db
const moment = require('moment')

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
        tweet.date = moment(tweet.createdAt).format('lll')
        tweet.time = moment(tweet.createdAt).fromNow()
        tweet.countReplies = tweet.Replies.length
        tweet.countLikes = tweet.LikedUsers.length
        tweet.isLike = reqUser.LikedTweets.some(like => tweet.id === like.id)
      })

      // 取 Top 10 的 user ，排除 0 追隨的人
      const topUsers = users.filter(user => user.Followers.length > 0)
        .sort((a, b) => b.Followers.length - a.Followers.length)
        .slice(0, 10)

      topUsers.forEach(user => {
        user.isFollowing = reqUser.Followings.some(following => user.id === following.id)
        user.isSelf = (user.id === reqUser.id)
        user.CountFollowers = user.Followers.length
      })

      // POST tweet 失敗時，保留內文
      const history = req.flash('description')

      res.render('tweets', { css: 'tweets', tweets, topUsers, history })

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
  },

  getReplies: async (req, res) => {
    try {
      const user = helpers.getUser(req)
      const showedTweet = await Tweet.findByPk(req.params.tweet_id, {
        include: [
          'LikedUsers',
          { model: User,  
            include: [
              // 僅用於計數，只包入 'id' 以輕量化
              { model: Tweet, attributes: ['id'] },
              { association: 'Followings', attributes: ['id'] },
              { association: 'Followers', attributes: ['id'] },
              { association: 'LikedTweets', attributes: ['id'] },
            ]
          },
          { model: Reply, include: User }
        ],
        order: [['Replies', 'id', 'ASC']]
      })

      const showedUser = showedTweet.User

      // 頁面 Tweets 資訊
      showedTweet.date = moment(showedTweet.createdAt).format('lll')
      showedTweet.time = moment(showedTweet.createdAt).fromNow()
      showedTweet.countReplies = showedTweet.Replies.length
      showedTweet.countLikes = showedTweet.LikedUsers.length
      showedTweet.isLiked = showedTweet.LikedUsers.some(likedUser => user.id === likedUser.id)

      // 頁面 Replies 資訊
      const replies = showedTweet.Replies
      replies.forEach(reply => {
        reply.date = moment(reply.createdAt).format('lll')
        reply.time = moment(reply.createdAt).fromNow()
      })

      // 頁面 User 資訊
      showedUser.isFollowing = user.Followings.some(following => showedUser.id === following.id)
      showedUser.isSelf = (showedUser.id === user.id)

      // POST reply 失敗時，保留內文
      const history = req.flash('comment')

      res.render('userReplies', { showedTweet, showedUser, replies, history })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  postReply: async (req, res) => {
    try {
      const user = helpers.getUser(req)
      const { comment, TweetId } = req.body

      // 如內容空白將會產生警告
      if (!comment) {
        req.flash('error', '請填寫回覆內容')
        return res.redirect('back')
      }
      // 內容超過 140 字會產生警告
      if (comment.length > 140) {
        req.flash('error', '不得超過 140 字')
        req.flash('comment', comment)
        return res.redirect('back')
      }

      await Reply.create({
        UserId: user.id,
        TweetId: TweetId,
        comment: comment
      })

      req.flash('success', '發送成功！')
      res.redirect(`/tweets/${TweetId}/replies`)

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}
