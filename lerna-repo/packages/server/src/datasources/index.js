const LaunchAPI = require('./launch');
const UserAPI = require('./user');
const DbApi = require('./DbApi');
 
var data = {};

module.exports = function(store){
	
	data = {
	  launchAPI: new LaunchAPI(),
	  userAPI: new UserAPI({ store }),
	  DbApi: new DbApi({store}),
	};

	return function(){
	  return data;
	};
}