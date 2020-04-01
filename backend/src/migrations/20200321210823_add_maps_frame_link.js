exports.up = function(knex) {
  return knex.schema.table('locations', function (table) {
    table.text('maps_iframe').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('locations', function (table) {
    table.dropColumn('maps_iframe');
  });
};