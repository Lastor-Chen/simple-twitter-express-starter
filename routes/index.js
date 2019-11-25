const tweetsController = require('../controllers/tweetsControllers')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')



module.exports = app => {
  app.get('/', (req, res) => res.redirect('/tweets'))
  app.get('/tweets', tweetsController.getTweets)

  app.get('/admin', (req, res) => res.redirect('/admin/tweets'))
  app.get('/admin/tweets', adminController.getTweets)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

}