module.exports = {

  getAccessToken: getAccessToken,
  getAuthorizationCode: function(){console.log("getAuthorizationCode", arguments)},
  getClient:getClient,
  getRefreshToken: function(){console.log("getRefreshToken", arguments)},
  getUser: function(){console.log("getUser", arguments)},
  getUserFromClient: function(){console.log("getUserFromClient", arguments)},
  //grantTypeAllowed, Removed in oauth2-server 3.0
  revokeAuthorizationCode: function(){console.log("revokeAuthorizationCode", arguments)},
  revokeToken: function(){console.log("revokeToken", arguments)},
  saveToken: function(){console.log("saveToken", arguments)},
  saveAuthorizationCode: function(){console.log("saveAuthorizationCode", arguments)},
  validateScope: function(){console.log("validateScope", arguments)},
  verifyScope: function(){console.log("verifyScope", arguments)},
}



function getAccessToken(bearerToken) {
    
    var token = {};
    token.user = "aaa";
    token.client = "sasas";
    token.scope = "sdfsdf,sdf,";
    token.expires = (new Date()) 
    token.accessTokenExpiresAt = token.expires
    return token;
}




function getClient(clientId, clientSecret) {
    console.log("getClient", arguments);
    return {
        grants: ['authorization_code', 'password', 'refresh_token', 'client_credentials'],
        redirectUris: ["http://www.google.pt"]
    };
    
}