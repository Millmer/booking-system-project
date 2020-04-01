const db = require('./db');

module.exports = {
  async list() {
    try {
      const rows = await db.select(['cities.*', 'countries.code']).table('cities').innerJoin('countries', 'cities.country_id', 'countries.id');
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async listForHost(host_id) {
    try {
      const rows = await db.select(['cities.*', 'countries.code'])
      .table('cities')
      .innerJoin('countries', 'cities.country_id', 'countries.id')
      .innerJoin('users', 'countries.id', 'users.country_id')
      .where('users.id', host_id);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async listLocations(city_id) {
    try {
      const rows = await db.select().table('locations').where('city_id', city_id);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async get(id) {
    try {
      let rows = await db('cities').where({ id });
      if (!rows || !rows.length) throw 'CITY_NOT_FOUND';
      const city = rows[0];
      return city;
    } catch (error) {
      throw error;
    }
  },
  async create(city) {
    try {
      const cityId = await db('cities').returning('id').insert(city);

      return Object.assign(city, { id: cityId[0] });
    } catch (error) {
      throw error;
    }
  },
  async update(id, values) {
    try {
      const rows = await db('cities').where({ id });
      if (!rows || !rows.length) throw 'CITY_NOT_FOUND';
      Object.assign(values, { updated_at: db.fn.now() });
      const city = await db('cities').where({ id }).update(values, [...Object.keys(values), 'id']);
      return city[0];
    } catch (error) {
      throw error;
    }
  },
  async destroy(id) {
    try {
      const rows = await db('cities').where({ id });
      if (!rows || !rows.length) throw 'CITY_NOT_FOUND';
      await db('cities').where({ id }).delete();
      const city = rows[0];
      return city;
    } catch (error) {
      throw error;
    }
  }
};