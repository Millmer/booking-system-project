exports.up = function(knex) {
  return knex.schema.createTable('locations', function(table) {
    table.increments().primary();
    table.integer('city_id').notNull().references('cities.id').onDelete('CASCADE');
    table.integer('host_id').notNull().references('users.id').onDelete('CASCADE');
    table.text('name').notNull();
    table.text('address').notNull();
    table.text('image_url').notNull();
    table.integer('kayak_number').notNull();
    table.time('default_booking_length').notNull();
    table.jsonb('opening_hours').notNull();
    table.jsonb('blocked_days').nullable().defaultTo([]);
    table.text('description').nullable();
    table.text('maps_url').nullable();
    table.decimal('trash_collected_kg').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('locations');
};