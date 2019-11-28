const express = require('express')
const helpers = require('./_helpers');
const handlebars = require('express-handlebars')
const db = require('./models')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.listen(port, () => {
  // app 啟動時，顯示當前 NODE_ENV
  const mode = process.env.NODE_ENV || 'development'
  console.log(`\n[App] Using environment "${mode}".`)
  console.log(`[App] Example app listening on port ${port}!`)
})

require('./routes')(app)
