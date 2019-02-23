var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

router.get('/', function(req, res, next){
	res.render('main/index', {title : 'Template | HandleBars'});
});

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/signup', function (req, res, next) {
	var messages = req.flash('error');
	res.render('signup',{csrfToken: req.csrfToken(), title: 'Register | NACOSS', messages: messages, hasErrors: messages.length > 0})
})

router.get('/profile', isLoggedIn, function (req, res, next){
	res.render('profile', {user: req.user, csrfToken: req.csrfToken(), title: 'User Profile | NACOSS'})
})

router.get('/signin', function (req, res, next){
	var messages = req.flash('error');
	res.render('signin', {csrfToken: req.csrfToken(), title: 'SignIn NACOSS', messages: messages, hasErrors: messages.length > 0})
})

// Register User
router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/signup',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/profile');
    }
});


router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
}));

router.get('/logout', isLoggedIn, function(req, res){
  var name = req.user.fullname;
  console.log("LOGGIN OUT " + req.user.fullname)
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out " + name + "!";
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/signin');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}


//ERROR 404 ROUTES
router.get('*', function(req, res, next) {
    res.render('error');
});

module.exports = router;

