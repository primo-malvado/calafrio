exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(t) {
        t.increments('id').unsigned().primary();
        t.string('name').notNull();
        t.string('email').notNull();

        /*
        t.dateTime('createdAt').notNull();
        t.dateTime('updatedAt').nullable();
        t.dateTime('deletedAt').nullable();

        t.text('decription').nullable();
        t.decimal('price', 6, 2).notNull();
        t.enum('category', ['apparel', 'electronics', 'furniture']).notNull();
        */
    });
};

exports.down = function(knex, Promise) {
   return knex.schema.dropTable('users');
};
