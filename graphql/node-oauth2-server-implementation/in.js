var express = require('express');
var oauthServer = require('oauth2-server');
var Request = oauthServer.Request;
var Response = oauthServer.Response;
var authenticate = require('./authenticate')
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// https://github.com/manjeshpv/node-oauth2-server-implementation/blob/master/components/oauth/models.js
var oauth = new oauthServer({
  model: require('./model.js')
});

app.all('/oauth/token', function(req,res,next){
    var request = new Request(req);
    var response = new Response(res);

    oauth
        .token(request,response)
        .then(function(token) {
            // Todo: remove unnecessary values in response
            return res.json(token)
        }).catch(function(err){
            return res.status( 500).json(err)
        })
});


//http://localhost:3000/authorise?client_id=rui&redirect_uri=http://www.infosecinstitute.com
  app.post('/authorise', function(req, res){
      
      
    var request = new Request(req);
    var response = new Response(res);
console.log(Object.keys(request), Object.keys(response));



    return oauth.authorize(request, response).then(function(success) {
        res.json(success)
    }).catch(function(err){
      res.status(err.code || 500).json(err)
    })
  });
  

app.get('/secure', authenticate(), function(req,res){
  res.json({message: 'Secure data'})
});



/*
 
 
http://localhost:3000/me

Authorization: Bearer ACCESS_TOKEN
*/


app.get('/me', authenticate(), function(req,res){
  res.json({
    me: req.user,
    messsage: 'Authorization success, Without Scopes, Try accessing /profile with `profile` scope',
    description: 'Try postman https://www.getpostman.com/collections/37afd82600127fbeef28',
    more: 'pass `profile` scope while Authorize'
  })
});

app.get('/profile', authenticate({scope:'profile'}), function(req,res){
  res.json({
    profile: req.user
  })
});

app.listen(3000);