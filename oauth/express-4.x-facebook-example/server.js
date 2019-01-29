require('dotenv').config();

var express = require('express');
var passport = require('passport');

var Strategy = require('passport-facebook').Strategy;
var OAuth2Strategy = require('passport-oauth2').Strategy;




var oStrat = new OAuth2Strategy({

    authorizationURL: 'http://localhost:3000/dialog/authorize',
    tokenURL: 'http://localhost:3000/oauth/token',
    clientID: "xyz123",
    clientSecret: "ssh-password",
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
oStrat.name = "my"

passport.use(oStrat);








let appId = "324791828243608";
let appSecret = "021c69c1795672929cb812562dd6b570";


process.env['FACEBOOK_CLIENT_ID'] = appId;
process.env['FACEBOOK_CLIENT_SECRET'] = appSecret;
// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy({
    clientID: process.env['FACEBOOK_CLIENT_ID'],
    clientSecret: process.env['FACEBOOK_CLIENT_SECRET'],
    callbackURL: '/returnFacebook'
  },
  function(accessToken, refreshToken, profile, cb) {

    console.log(profile);
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));
/*

*/
// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
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

app.get('/login/facebook', passport.authenticate('facebook'));

app.get('/login/oauth2', passport.authenticate('my'));



app.get('/returnOAuth', 
  passport.authenticate('my', { failureRedirect: '/login' }),
  function(req, res) {




    res.redirect('/');
  });
app.get('/returnFacebook', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });


app.get('/profileFacebook',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){


    res.render('profileFacebook', { user: req.user });
  });

app.get('/profileOAuth',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){


        console.log(req.user);

    res.render('profileOAuth', { user: req.user });
  });

app.listen(process.env['PORT'] || 8080);
