let users = require('./users')
let tweets = require('./tweets')

module.exports = (app) => {
  app.use('/', (req, res) => res.redirect('/tweets'))
  app.use('/tweets', tweets)
  app.use('/users', users)
}