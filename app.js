
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars');
const compression = require('compression')
const bodyParser = require('body-parser');

app.use(compression());
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.render('index', { layout: false })
})

app.post('/email', (req, res) => {
  console.log('email')
  res.render('index', { layout: false })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

