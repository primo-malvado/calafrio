
var oauthServer = require('oauth2-server');
 

var oauth = new oauthServer({
  model: require('./model.js')
});

module.exports = oauth;