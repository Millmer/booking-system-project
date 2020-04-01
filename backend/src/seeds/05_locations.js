exports.seed = function (knex) {
  // Deletes ALL existing entries
  const opening_hours = {
    monday: ["09:00:00~16:00:00"],
    tuesday: ["09:00:00~16:00:00"],
    wednesday: ["09:00:00~11:00:00", "13:00:00~17:00:00"],
    thursday: ["09:00:00~16:00:00"],
    friday: ["09:00:00~16:00:00"],
    saturday: [], // Represents closed
    sunday: [] // Represents closed
  };
  const blocked_days = JSON.stringify([
    {
      key: 'range',
      range: ['2020-03-07', '2020-03-17']
    }
  ]);
  return knex('locations').del()
    .then(function () {
      // Inserts seed entries
      return knex('locations').insert([
        { city_id: 3, host_id: 2, name: 'Kayak Bar', address: '456 denmark street', image_url: 'https://dummyimage.com/600x400/ffffff/040c57&text=Location+1', kayak_number: 35, default_booking_length: '01:30:00', opening_hours, blocked_days, description: 'amazing place', email_description: 'Further information for email', maps_url: 'https://goo.gl/maps/mC718KocHmN9Rhvo6', maps_iframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2248.7772024602928!2d12.597086715988201!3d55.692861180537335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x464c90eb8d422103%3A0xdfa8900ca2351e3c!2sThe%20Little%20Mermaid!5e0!3m2!1sen!2snl!4v1585730909420!5m2!1sen!2snl" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>', trash_collected_kg: 43.2 },
        { city_id: 9, host_id: 3, name: 'City Kayaking', address: '7B dublin lane', image_url: 'https://dummyimage.com/600x400/ffffff/040c57&text=Location+2', kayak_number: 12, default_booking_length: '01:00:00', opening_hours, blocked_days, description: 'canal side place', email_description: 'Further information for email', maps_url: 'https://goo.gl/maps/WDzK5UFwUApuhW4n6', maps_iframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2381.6339178631133!2d-6.262443484097867!3d53.349809079979806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48670e843e66bd41%3A0x4978811bdf0f9af7!2sThe%20Spire%2C%20North%20City%2C%20Dublin%2C%20Ireland!5e0!3m2!1sen!2snl!4v1585730938624!5m2!1sen!2snl" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>', trash_collected_kg: 123.32 }
      ]);
    });
};