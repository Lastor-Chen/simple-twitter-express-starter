const tweetsCtrller = require('../controllers/tweetsCtrller')
const userCtrller = require('../controllers/userCtrller.js')
const adminTweetsCtrller = require('../controllers/adminTweetsCtrller')

const { isAuth, isAdminAuth } = require('../middleware/auth')

module.exports = (app, passport) => {
  app.get('/', isAuth, (req, res) => res.redirect('/tweets'))

  app.use('/tweets', isAuth)
  app.get('/tweets', tweetsCtrller.getTweets)

  app.use('/tweets', isAdminAuth)
  app.get('/admin', (req, res) => res.redirect('/admin/tweets'))
  app.get('/admin/tweets', adminTweetsCtrller.getTweets)

  app.get('/signup', userCtrller.signUpPage)
  app.post('/signup', userCtrller.signUp)

  app.get('/signin', userCtrller.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userCtrller.signIn)
  app.get('/logout', userCtrller.logout)
}