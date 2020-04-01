exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('cities').del()
  .then(function () {
    // Inserts seed entries
    return knex('cities').insert([
      {country_id: 1, city: "Aalborg", image_url: "https://dummyimage.com/600x400/cccccc/000000&text=Aalborg"},
      {country_id: 1, city: "Aarhus", image_url: "https://dummyimage.com/600x400/cccccc/000000&text=Aarhus"},
      {country_id: 1, city: 'Copenhagen', image_url: "https://dummyimage.com/600x400/cccccc/000000&text=Copenhagen"},
      {country_id: 1, city: "Folkemødet - Bornholm", image_url: "https://dummyimage.com/600x400/cccccc/000000&text=Folkemodet"},
      {country_id: 1, city: "Odense", image_url: "https://dummyimage.com/600x400/cccccc/000000&text=Odense"},
      {country_id: 1, city: "Præstø", image_url: "https://dummyimage.com/600x400/cccccc/000000&text=Praesto"},
      {country_id: 2, city: "Berlin", image_url: "https://dummyimage.com/600x400/cccccc/000000&text=Berlin"},
      {country_id: 2, city: "Hamburg", image_url: "https://dummyimage.com/600x400/cccccc/000000&text=Hamburg"},
      {country_id: 3, city: "Dublin", image_url: "https://dummyimage.com/600x400/cccccc/000000&text=Hamburg"},
      {country_id: 4, city: "Bergen", image_url: "https://dummyimage.com/600x400/cccccc/000000&text=Bergen"},
      {country_id: 5, city: "Stockholm", image_url: "https://dummyimage.com/600x400/cccccc/000000&text=Stockholm"},
    ]);
  });
};