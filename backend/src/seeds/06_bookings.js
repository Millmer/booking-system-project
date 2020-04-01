exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('bookings').del()
  .then(function () {
    // Inserts seed entries
    return knex('bookings').insert([
      {customer_id: 1, location_id: 1, number_of_people: 2, date: '2020-03-05 10:00:00', duration: '01:00:00', cancellation_token: 'abc123', booking_code: 'atd196' },
      {customer_id: 2, location_id: 1, number_of_people: 6, date: '2020-03-21 15:00:00', duration: '01:00:00', cancellation_token: 'xyz789', booking_code: 'glr834' },
      {customer_id: 3, location_id: 2, number_of_people: 3, date: '2020-03-15 13:00:00', duration: '01:00:00', cancellation_token: 'pqr456', booking_code: 'cue879' },
      {customer_id: 4, location_id: 1, number_of_people: 6, date: '2020-03-21 13:00:00', duration: '01:00:00', cancellation_token: 'uvw035', booking_code: 'k4wd29' },
      {customer_id: 2, location_id: 1, number_of_people: 34, date: '2020-03-14 10:15:00', duration: '01:30:00', cancellation_token: 'jft581', booking_code: 'kafw49' },
      {customer_id: 2, location_id: 1, number_of_people: 1, date: '2020-03-14 10:30:00', duration: '01:00:00', cancellation_token: 'las753', booking_code: 'kgfwd9' }
    ]);
  });
};