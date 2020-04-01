exports.up = function(knex) {
  return knex.schema.createTable('customers', function(table) {
    table.increments().primary();
    table.text('name').notNull();
    table.text('nationality').notNull();
    table.text('city_of_residence').notNull();
    table.text('country_of_residence').notNull();
    table.boolean('above_eighteen').notNull();
    table.text('telephone_number').notNull();
    table.text('email').notNull();
    table.text('gender').nullable();
    table.boolean('previous_experience').notNull();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('customers');
};
