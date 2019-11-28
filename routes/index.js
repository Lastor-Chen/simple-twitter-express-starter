const tweetsController = require('../controllers/tweetsController')

module.exports = app => {
  app.get('/', (req, res) => res.redirect('/tweets'))
  app.get('/tweets', tweetsController.getTweets)
}