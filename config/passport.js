var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
	// body...
	done(null, user.id);
});


passport.deserializeUser(function (id, done){
	User.findById(id, function (err, user){
		done(err, user);
	});
});


passport.use('local.signup', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function (req, email, password, done){
	let matricnumber = req.body.matricnumber;
	let fullname = req.body.fullname;
	console.log(fullname);
	//Sanitizing the inputs
	req.checkBody('email', 'Invalid email').notEmpty().isEmail();
	req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
	var errors = req.validationErrors();
	if (errors) {
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}
	User.findOne({'email' : email}, function (err, user){  //Checking if the user already has an account
		if (err) {
			return done(err);
		}
		if (user) {
			return done(null, false, { message: 'Email is already in use' });
		}
		var newUser = new User();
		newUser.email = email;
		newUser.password = newUser.encryptPassword(password);
		console.log(newUser);
		newUser.save(function (err, result) {
			if (err) { 
				console.log(err)
				return done(err);
			}
			return done(null, newUser);
		});
	});
})); 

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    req.checkBody('email', 'Invalid username').notEmpty();
    req.checkBody('password', 'Invalid password').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email' : email}, function (err, user){
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'No user found' });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Wrong password' });
        };
        console.log("User Found. logging in!!");
        return done(null, user);
    });
}));