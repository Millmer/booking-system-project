exports.up = function(knex) {
  return knex.schema.createTable('bookings', function(table) {
    table.increments().primary();
    table.integer('customer_id').notNull().references('customers.id').onDelete('CASCADE');
    table.integer('location_id').notNull().references('locations.id').onDelete('SET NULL');
    table.integer('number_of_people').notNull();
    table.enu('status', ['CREATED', 'COMPLETED', 'CANCELLED']).notNull().defaultTo('CREATED');
    table.datetime('date').notNull();
    table.time('duration').notNull();
    table.text('cancellation_token').nullable().unique();
    table.text('booking_code').nullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('bookings');
};