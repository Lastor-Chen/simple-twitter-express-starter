const tweetsController = require('../controllers/tweetsControllers')
module.exports = app => {
  app.get('/', (req, res) => res.redirect('/tweets'))
  app.get('/tweets', tweetsController.getTweets)

}