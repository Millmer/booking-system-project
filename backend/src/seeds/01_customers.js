exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('customers').del()
  .then(function () {
    // Inserts seed entries
    return knex('customers').insert([
      {name: 'Ollie', nationality: 'GB', city_of_residence: 'London', country_of_residence: 'GB', above_eighteen: true, telephone_number: '+447456895632', email: 'oliver.grubb@developyn.com', gender: 'male', previous_experience: true},
      {name: 'Cindy', nationality: 'NO', city_of_residence: 'Oslo', country_of_residence: 'NO', above_eighteen: true, telephone_number: '+477513489765', email: 'cindy@developyn.com', gender: 'female', previous_experience: true},
      {name: 'Robert', nationality: 'BE', city_of_residence: 'Paris', country_of_residence: 'FR', above_eighteen: true, telephone_number: '+337435121454', email: 'robert@developyn.com', gender: 'other', previous_experience: false},
      {name: 'Bob', nationality: 'GB', city_of_residence: 'Birmingham', country_of_residence: 'GB', above_eighteen: true, telephone_number: '+4427456895632', email: 'bob@developyn.com', gender: 'male', previous_experience: false}
    ]);
  });
};