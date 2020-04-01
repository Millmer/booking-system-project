const db = require('./db');

module.exports = {
  async list() {
    try {
      const rows = await db.select(
        ['locations.*', 'cities.city', 'users.email', 'countries.id AS country_id', 'countries.code'])
        .table('locations')
        .innerJoin('cities', 'locations.city_id', 'cities.id')
        .innerJoin('countries', 'cities.country_id', 'countries.id')
        .innerJoin('users', 'locations.host_id', 'users.id');
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async listForHost(host_id) {
    try {
      const rows = await db.select(
        ['locations.*', 'cities.city', 'users.email', 'countries.id AS country_id', 'countries.code'])
      .table('locations')
      .innerJoin('cities', 'locations.city_id', 'cities.id')
      .innerJoin('countries', 'cities.country_id', 'countries.id')
      .innerJoin('users', 'locations.host_id', 'users.id')
      .where('users.id', host_id);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async get(id) {
    try {
      let rows = await db('locations').where({ id });
      if (!rows || !rows.length) throw 'LOCATION_NOT_FOUND';
      const location = rows[0];
      return location;
    } catch (error) {
      throw error;
    }
  },
  async create(location) {
    try {
      const locationId = await db('locations').returning('id').insert(location);

      return Object.assign(location, { id: locationId[0] });
    } catch (error) {
      throw error;
    }
  },
  async update(id, values) {
    try {
      const rows = await db('locations').where({ id });
      if (!rows || !rows.length) throw 'LOCATION_NOT_FOUND';
      Object.assign(values, { updated_at: db.fn.now() });
      const location = await db('locations').where({ id }).update(values, [...Object.keys(values), 'id']);
      return location[0];
    } catch (error) {
      throw error;
    }
  },
  async destroy(id) {
    try {
      const rows = await db('locations').where({ id });
      if (!rows || !rows.length) throw 'LOCATION_NOT_FOUND';
      await db('locations').where({ id }).delete();
      const location = rows[0];
      return location;
    } catch (error) {
      throw error;
    }
  },
};