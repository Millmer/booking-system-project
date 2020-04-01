exports.up = function(knex) {
  return knex.schema.createTable('cities', function(table) {
    table.increments().primary();
    table.integer('country_id').notNull().references('countries.id').onDelete('CASCADE');
    table.text('city').notNull().unique();
    table.text('image_url').notNull();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('cities');
};
