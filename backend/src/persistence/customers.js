const db = require('./db');

module.exports = {
  async list() {
    try {
      const rows = await db.select().table('customers');
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async get(id) {
    try {
      let rows = await db('customers').where({ id });
      if (!rows || !rows.length) throw 'CUSTOMER_NOT_FOUND';
      const customer = rows[0];
      return customer;
    } catch (error) {
      throw error;
    }
  },
  async create(customer) {
    try {
      const customerId = await db('customers').returning('id').insert(customer);

      return Object.assign(customer, { id: customerId[0] });
    } catch (error) {
      throw error;
    }
  },
  async update(id, values) {
    try {
      const rows = await db('customers').where({ id });
      if (!rows || !rows.length) throw 'CUSTOMER_NOT_FOUND';
      Object.assign(values, { updated_at: db.fn.now() });
      const customer = await db('customers').where({ id }).update(values, [...Object.keys(values), 'id']);
      return customer[0];
    } catch (error) {
      throw error;
    }
  },
  async destroy(id) {
    try {
      const rows = await db('customers').where({ id });
      if (!rows || !rows.length) throw 'CUSTOMER_NOT_FOUND';
      await db('customers').where({ id }).delete();
      const customer = rows[0];
      return customer;
    } catch (error) {
      throw error;
    }
  }
};