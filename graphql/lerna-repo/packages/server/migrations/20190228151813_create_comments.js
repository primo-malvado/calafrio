exports.up = function(knex, Promise) {
    return knex.schema.createTable('comments', function(t) {
        t.increments('id').unsigned().primary();
        t.string('text').notNull();
        t.integer('post_id').references('id').inTable('posts').notNull().onDelete('cascade');        
		t.integer('author_id').references('id').inTable('users').notNull().onDelete('cascade');
    });
};

exports.down = function(knex, Promise) {
   return knex.schema.dropTable('comments');
};
