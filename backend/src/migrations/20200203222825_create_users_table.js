exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments().primary();
    table.string('email').notNull().unique();
    table.string('password').notNull();
    table.enu('role', ['ADMIN', 'HOST']).notNull().defaultTo('HOST');
    table.string('first_name').nullable();
    table.string('last_name').nullable();
    table.integer('country_id').nullable().references('countries.id').onDelete('CASCADE');;
    table.dateTime('created_at').defaultTo(knex.fn.now());
    table.dateTime('updated_at').defaultTo(knex.fn.now());
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('users');
}