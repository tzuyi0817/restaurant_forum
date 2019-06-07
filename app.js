const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const app = express()
const db = require('./models')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(passport.session())

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))

app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.listen(3000, () => {
  db.sequelize.sync()
  console.log('Example app listening on http://localhost:3000')
})

require('./routes')(app, passport)