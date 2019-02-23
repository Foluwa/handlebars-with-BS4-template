// FileName: index.js
// Import express
const express = require('express');
const flash = require('connect-flash');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const expressHbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const path = require('path');
// Setup server port
const port = process.env.PORT || 3000;

let app = express();

let keys = require('./keys.js');
let indexRouter = require('./routes/index');


// Initialize the app
var sess = {
  secret: 'keyboardcat',
  resave: false,
  saveUninitialized: false,
  cookie: {}
}



//DATABASE CONNECTION
// mongoose.Promise = global.Promise;
// mongoose.connect(keys.mongodb.dbURI, { useMongoClient: true }).then(//useNewUrlParser: true,
//   function(res){
//    console.log("Connected to Database Successfully.");
//   }
// ).catch(function(err){
//   console.log("Connection to Database failed.");
//   console.log(err);
// });
require('./config/passport');


app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', '.hbs');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(validator());
app.use(session(sess))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next){
	res.locals.login = req.isAuthenticated();
	res.locals.session = req.session;
	next();
})

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Launch app to listen to specified port
app.listen(port, function () {
     console.log("Navigate your browser to localhost: " + port);
});