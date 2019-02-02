const express = require('express');
const router = express.Router();
const app = express();
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
//const favicon = require('serve-favicon');

const routes = require('./routes/index');

const port = 3000;


// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));//favicon.ico
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //false

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = router;