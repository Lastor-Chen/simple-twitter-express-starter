const tweetsController = require('../controllers/tweetsController')
const userController = require('../controllers/userController.js')

module.exports = app => {
  app.get('/', (req, res) => res.redirect('/tweets'))
  app.get('/tweets', tweetsController.getTweets)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
}