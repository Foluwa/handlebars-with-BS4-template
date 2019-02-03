// FileName: index.js
// Import express
let express = require('express');
let flash = require('connect-flash');
var session = require('express-session')
var cookieParser = require('cookie-parser')
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var passport = require('passport');
var keys = require('./keys.js');
var bodyParser = require('body-parser');
var validator = require('express-validator');

var indexRouter = require('./routes/index');

let path = require('path');

// Initialize the app
var bodyParser = require('body-parser')
var sess = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {}
}


let app = express();

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true }).then(//useNewUrlParser: true,
  function(res){
   console.log("Connected to Database Successfully.");
  }
).catch(function(err){
  console.log("Connection to Database failed.");
  console.log(err);
});
require('./config/passport');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser())
app.use(validator());
app.use(session(sess))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.engine('.hbs', exphbs({ defaultLayout: 'layout', extname: '.hbs' }));
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');


app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
	res.locals.login = req.isAuthenticated();
	res.locals.session = req.session;
	next();
})

app.use('/', indexRouter);



// Setup server port
var port = process.env.PORT || 3000;


// Launch app to listen to specified port
app.listen(port, function () {
     console.log("NACOSS webiste running on " + port);
});