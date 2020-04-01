exports.up = function(knex) {
  return knex.schema.table('locations', function (table) {
    table.text('email_description').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('locations', function (table) {
    table.dropColumn('email_description');
  });
};