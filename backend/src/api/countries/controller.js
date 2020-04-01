const Country = require('../../persistence/countries');

module.exports = {
  async list (req, res) {
    try {
      const countries = await Country.list();

      return res.status(200).json(countries);
    } catch (error) {
      console.error(`listCountries >> Error: ${error.stack}`);
      res.status(500).json();
    }
  },
  async get (req, res) {
    try {
      const countryId = req.params.id;
      if (!countryId) {
        return res.status(400).json({message: 'CountryId must be provided'});
      }

      const country = await Country.get(countryId);

      return res.status(200).json(country);
    } catch (error) {
      console.error(`getCountry({ id: ${req.params.id} }) >> Error: ${error.stack}`);
      res.status(500).json();
    }
  },
  async create (req, res) {
    try {
      const { name, code } = req.body;
      if (!name || !code) {
        return res.status(400).json({message: 'Name and Country Code must be provided'});
      }

      const country = await Country.create({ name, code });
      if (!country) {
        return res.status(400).json({message: 'Country already exists'});
      }

      return res.status(200).json(country);
    } catch (error) {
      console.error(`createCountry({ name: ${req.body.name} }) >> Error: ${error.stack}`);
      res.status(500).json();
    }
  },
  async edit (req, res) {
    try {
      const countryId = req.params.id;
      if (!countryId) {
        return res.status(400).json({message: 'CountryId must be provided'});
      }

      const { name, code } = req.body;
      if (!name || !code) {
        return res.status(400).json({message: 'Name and Country Code must be provided'});
      }

      const country = await Country.update(countryId, { name, code });

      return res.status(200).json(country);
    } catch (error) {
      console.error(`editCountry({ id: ${req.params.id} }) >> Error: ${error.stack}`);
      res.status(500).json();
    }
  },
  async destroy (req, res) {
    try {
      const countryId = req.params.id;
      if (!countryId) {
        return res.status(400).json({message: 'CountryId must be provided'});
      }

      const country = await Country.destroy(countryId);

      return res.status(200).json(country);
    } catch (error) {
      console.error(`deleteCountry({ id: ${req.params.id} }) >> Error: ${error.stack}`);
      res.status(500).json();
    }
  }
};