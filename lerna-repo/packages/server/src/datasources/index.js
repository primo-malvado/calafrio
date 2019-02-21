
const LaunchAPI = require('./launch');
const UserAPI = require('./user');
const AutorAPI = require('./autor');
const LivroAPI = require('./livro');


var data = {};

module.exports = function(store){

	 
	data = {
	  launchAPI: new LaunchAPI(),
	  userAPI: new UserAPI({ store }),
	  autorAPI: new AutorAPI({store}),
	  livroAPI: new LivroAPI({store}),
	};

	return function(){
	  return data;
	};



}
 
