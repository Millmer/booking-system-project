exports.up = function(knex) {
  return knex.schema.createTable('countries', function(table) {
    table.increments().primary();
    table.text('name').notNull().unique();
    table.text('code').notNull().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('countries');
};