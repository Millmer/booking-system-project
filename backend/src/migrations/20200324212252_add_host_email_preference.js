exports.up = function(knex) {
  return knex.schema.table('users', function (table) {
    table.boolean('do_send_daily_booking_email').notNull().defaultTo(true);
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('do_send_daily_booking_email');
  });
};