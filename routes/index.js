const weetsCtrller = require('../controllers/tweetsCtrller')
const userCtrller = require('../controllers/userCtrller.js')

module.exports = app => {
  app.get('/', (req, res) => res.redirect('/tweets'))
  app.get('/tweets', weetsCtrller.getTweets)

  app.get('/signup', userCtrller.signUpPage)
  app.post('/signup', userCtrller.signUp)
}