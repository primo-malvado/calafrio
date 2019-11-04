const knex = require("knex");

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../knexfile.js')[env];



var conn = knex(config);


var bookshelf = require('bookshelf')(conn);




var User = bookshelf.Model.extend({
  tableName: 'users'
});


var Post = bookshelf.Model.extend({
  tableName: 'posts',
  comments: function() {
    return this.hasMany(Comment);
  }


});

var Comment = bookshelf.Model.extend({
  tableName: 'comments'
});




module.exports = {
	conn, 
	models :{
		User,
		Post,
		Comment
	}
}