const express = require('express')
const helpers = require('./_helpers');
const handlebars = require('express-handlebars')

const app = express()
const port = 3000

app.engine('handlebars', handlebars())
app.set('view engine', handlebars({ defaultLayout: 'main' }))

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => {
  // app 啟動時，顯示當前 NODE_ENV
  const mode = process.env.NODE_ENV || 'development'
  console.log(`\n[App] Using environment "${mode}".`)
  console.log(`[App] Example app listening on port ${port}!`)
})

module.exports = app
