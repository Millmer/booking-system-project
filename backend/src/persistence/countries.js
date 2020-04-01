const db = require('./db');

module.exports = {
  async list() {
    try {
      const rows = await db.select().table('countries');
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async listCities(country_id) {
    try {
      const rows = await db.select().table('cities').where({ country_id });
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async get(id) {
    try {
      let rows = await db('countries').where({ id });
      if (!rows || !rows.length) throw 'COUNTRY_NOT_FOUND';
      const country = rows[0];
      return country;
    } catch (error) {
      throw error;
    }
  },
  async create(country) {
    try {
      country.name = country.name.charAt(0).toUpperCase() + country.name.slice(1)
      country.code = country.code.toUpperCase();
      const countryId = await db('countries').returning('id').insert(country);
      return Object.assign(country, { id: countryId[0] });
    } catch (error) {
      throw error;
    }
  },
  async update(id, values) {
    try {
      const rows = await db('countries').where({ id });
      if (!rows || !rows.length) throw 'COUNTRY_NOT_FOUND';
      Object.assign(values, { updated_at: db.fn.now() });
      if (values.name) values.name = values.name.charAt(0).toUpperCase() + values.name.slice(1)
      if (values.code) values.code = values.code.toUpperCase();
      const country = await db('countries').where({ id }).update(values, [...Object.keys(values), 'id']);
      return country[0];
    } catch (error) {
      throw error;
    }
  },
  async destroy(id) {
    try {
      const rows = await db('countries').where({ id });
      if (!rows || !rows.length) throw 'COUNTRY_NOT_FOUND';
      await db('countries').where({ id }).delete();
      const country = rows[0];
      return country;
    } catch (error) {
      throw error;
    }
  }
};