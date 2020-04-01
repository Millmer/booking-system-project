const bcrypt = require('bcrypt');
const db = require('./db');

module.exports = {
  async list() {
    try {
      const rows = await db.select(['users.*', 'countries.code']).table('users').leftJoin('countries', 'users.country_id', 'countries.id');
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async get(id) {
    try {
      let rows = await db('users').where({ id });
      if (!rows || !rows.length) throw 'USER_NOT_FOUND';
      const user = rows[0];
      return user;
    } catch (error) {
      throw error;
    }
  },
  async getByEmail(email) {
    try {
      let rows = await db('users').where({ email });
      if (!rows || !rows.length) throw 'USER_NOT_FOUND';
      const user = rows[0];
      return user;
    } catch (error) {
      throw error;
    }
  },
  async create(user) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const userId = await db('users').returning('id').insert(Object.assign(user, { password: hashedPassword }));
      return Object.assign(user, { id: userId[0] });
    } catch (error) {
      throw error;
    }
  },
  async update(id, values) {
    try {
      const rows = await db('users').where({ id });
      if (!rows || !rows.length) throw 'USER_NOT_FOUND';
      Object.assign(values, { updated_at: db.fn.now() });
      const user = await db('users').where({ id }).update(values, [...Object.keys(values), 'id']);
      return user[0];
    } catch (error) {
      throw error;
    }
  },
  async destroy(id) {
    try {
      const rows = await db('users').where({ id });
      if (!rows || !rows.length) throw 'USER_NOT_FOUND';
      await db('users').where({ id }).delete();
      const user = rows[0];
      return user;
    } catch (error) {
      throw error;
    }
  }
};