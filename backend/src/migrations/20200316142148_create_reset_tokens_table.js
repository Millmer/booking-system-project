exports.up = function(knex) {
  return knex.schema.createTable('reset_tokens', function(table) {
    table.increments().primary();
    table.string('email').notNull().references('users.email').onDelete('CASCADE');
    table.string('token').notNull().unique();
    table.datetime('expiration_date').notNull();
    table.boolean('used').notNull().defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('reset_tokens');
};