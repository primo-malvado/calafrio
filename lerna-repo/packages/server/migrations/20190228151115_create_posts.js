exports.up = function(knex, Promise) {
    return knex.schema.createTable('posts', function(t) {
        t.increments('id').unsigned().primary();
        t.string('title').notNull();
        t.string('body').notNull();
        t.integer('author_id').references('id').inTable('users').notNull().onDelete('cascade');
    });
};

exports.down = function(knex, Promise) {
   return knex.schema.dropTable('posts');
};

