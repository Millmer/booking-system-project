exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
  .then(function () {
    // Inserts seed entries
    return knex('users').insert([
      {role: 'ADMIN', first_name: 'Admin', last_name: 'One', email: 'aws+gk@developyn.com', password: '$2b$10$FOwo.U2gq9JkUctI1ReV9OLVitAxcSZivhzs5yQog8zwvbD.C/bu.'},
      {role: 'HOST', first_name: 'Copenhagen', last_name: 'One', email: 'aws+gk.cph@developyn.com', password: '$2b$10$FOwo.U2gq9JkUctI1ReV9OLVitAxcSZivhzs5yQog8zwvbD.C/bu.', country_id: 1, do_send_daily_booking_email: false},
      {role: 'HOST', first_name: 'Dublin', last_name: 'Two', email: 'aws+gk.dub@developyn.com', password: '$2b$10$FOwo.U2gq9JkUctI1ReV9OLVitAxcSZivhzs5yQog8zwvbD.C/bu.', country_id: 3, do_send_daily_booking_email: true}
    ]);
  });
};