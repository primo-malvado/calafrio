require('dotenv').config();

var express = require('express');
var passport = require('passport');
 
var OAuth2Strategy = require('passport-oauth2').Strategy;

OAuth2Strategy.prototype.userProfile = function(accessToken, done) {
  return done(null, {farrusco:1});
};
var oStrat = new OAuth2Strategy({

    authorizationURL: 'http://localhost:3000/dialog/authorize',
    tokenURL: 'http://localhost:3000/oauth/token',
    clientID: "abc123",
    clientSecret: "ssh-secret",
    callbackURL: '/returnOAuth'
  },
  function(accessToken, refreshToken, profile, cb) {


    console.log("profile", profile);
    return cb(null, profile);
    /*
    User.findOrCreate({ exampleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
    */
  }
)
 




passport.use(oStrat);





 
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });

 
app.get('/login/oauth2', passport.authenticate('oauth2'));



app.get(
  '/returnOAuth', 
  passport.authenticate(
    'oauth2', 
    { failureRedirect: '/login'}
  ),
  function(req, res) {
    res.redirect('/');
  }
);
 

 
app.get('/profileOAuth',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){


        console.log(req.user);

    res.render('profileOAuth', { user: req.user });
  });

app.listen(process.env['PORT'] || 8080);
