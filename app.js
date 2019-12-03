const express = require('express')
const helpers = require('./_helpers');
const exphbs = require('express-handlebars')
const passport = require('./config/passport')
const flash = require('connect-flash')
const session = require('express-session')

// ======================================
const app = express()
const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: 'hbs'
}))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))


app.use(session({
  secret: 'LastWendyTomatoBurger',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/upload', express.static(__dirname + '/upload'))

app.use(flash())
app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  res.locals.user = helpers.getUser(req)
  next()
})

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.listen(port, () => {
  // app 啟動時，顯示當前 NODE_ENV
  const mode = process.env.NODE_ENV || 'development'
  console.log(`\n[App] Using environment "${mode}".`)
  console.log(`[App] Example app listening on port ${port}!`)
})

module.exports = app
require('./routes')(app, passport)
