const LaunchAPI = require('./launch');
const UserAPI = require('./user');
const DbApi = require('./DbApi');
 
var data = {};

module.exports = function(store){
	return {
	  launchAPI: new LaunchAPI(),
	  userAPI: new UserAPI({ store }),
	  DbApi: new DbApi({store}),
	};

}