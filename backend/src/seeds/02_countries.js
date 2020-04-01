exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('countries').del()
  .then(function () {
    // Inserts seed entries
    return knex('countries').insert([
      {name: 'Denmark', code: 'DK'},
      {name: 'Germany', code: 'DE'},
      {name: 'Ireland', code: 'IE'},
      {name: 'Norway', code: 'NO'},
      {name: 'Sweden', code: 'SE'}
    ]);
  });
};