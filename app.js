
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars');
const compression = require('compression')
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer')
const config = require('config'); 

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

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'feanorkun@gmail.com',
      pass: config.get('Email.Senha')
    }
  });
  
  const mailOptions = { 
    from: req.body.email,
    to: config.get('Email.Destinatarios'),
    subject: config.get('Email.Assunto'),
    html: `<!DOCTYPE html>
            <html>
            <head>
            </head>
            <body>
            <table>
              <tr>
                <td>Nome:</td>
                <td>`+req.body.name+`</td>
              </tr>
              <tr>
              <td>Telefone:</td>
                <td>`+req.body.phone+`</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>`+req.body.email+`</td>
              </tr>
              <tr>
              <td>Mensagem:</td>
                <td>`+req.body.message+`</td>
              </tr>
            </table>
            </body>
            </html>`
  };

  transporter.sendMail(mailOptions);

  res.render('index', { layout: false })
})

app.listen(port, () => {
  console.log('app listening at http://localhost:${port}')
})

