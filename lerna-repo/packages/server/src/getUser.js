module.exports = function(req){


	debugger;
	
  const token = (req.headers && req.headers.authorization) || '';

	return  {id: 1, name: 'Rui Costa', email:"rui.fajozes@gmail.com"};
}