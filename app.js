const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const db = require('./models')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.listen(3000, () => {
  db.sequelize.sync()
  console.log('Example app listening on http://localhost:3000')
})

require('./routes')(app)