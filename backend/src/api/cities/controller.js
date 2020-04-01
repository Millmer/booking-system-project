const City = require('../../persistence/cities');

module.exports = {
  async list (req, res) {
    try {
      const cities = (req.user.role === 'HOST') ? await City.listForHost(req.user.id) : await City.list();

      return res.status(200).json(cities);
    } catch (error) {
      console.error(`listCities >> Error: ${error.stack}`);
      res.status(500).json();
    }
  },
  async get (req, res) {
    try {
      const cityId = req.params.id;
      if (!cityId) {
        return res.status(400).json({message: 'CityId must be provided'});
      }

      const city = await City.get(cityId);

      return res.status(200).json(city);
    } catch (error) {
      console.error(`getCity({ id: ${req.params.id} }) >> Error: ${error.stack}`);
      res.status(500).json();
    }
  },
  async create (req, res) {
    try {
      const { country_id, city, image_url } = req.body;
      if (!country_id || !city || !image_url) {
        return res.status(400).json({message: 'CountryId, City and ImageURL must be provided'});
      }

      const cityRow = await City.create({ country_id, city, image_url });
      if (!cityRow) {
        return res.status(400).json({message: 'City already exists'});
      }

      return res.status(200).json(cityRow);
    } catch (error) {
      console.error(`createCity({ city: ${req.body.city} }) >> Error: ${error.stack}`);
      res.status(500).json();
    }
  },
  async edit (req, res) {
    try {
      const cityId = req.params.id;
      if (!cityId) {
        return res.status(400).json({message: 'CityId must be provided'});
      }

      const { country_id, city, image_url } = req.body;
      if (!country_id || !city || !image_url) {
        return res.status(400).json({message: 'CountryId, City and ImageURL must be provided'});
      }

      const cityRow = await City.update(cityId, { country_id, city, image_url });

      return res.status(200).json(cityRow);
    } catch (error) {
      console.error(`editCity({ id: ${req.params.id} }) >> Error: ${error.stack}`);
      res.status(500).json();
    }
  },
  async destroy (req, res) {
    try {
      const cityId = req.params.id;
      if (!cityId) {
        return res.status(400).json({message: 'CityId must be provided'});
      }

      const city = await City.destroy(cityId);

      return res.status(200).json(city);
    } catch (error) {
      console.error(`deleteCity({ id: ${req.params.id} }) >> Error: ${error.stack}`);
      res.status(500).json();
    }
  }
};