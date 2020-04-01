const db = require('./db');

module.exports = {
  async findValid({ email, token }) {
    try {
      const rows = await db('reset_tokens').where({ email, token, used: false }).andWhere('expiration_date', '>', new Date());
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
  async create(record) {
    try {
      const recordId = await db('reset_tokens').returning('id').insert(record);

      return Object.assign(record, { id: recordId[0] });
    } catch (error) {
      throw error;
    }
  },
  async setUsed(email) {
    try {
      const records = await db('reset_tokens').where({ email }).update({ used: true });
      return records[0];
    } catch (error) {
      throw error;
    }
  },
  async destroyOld() {
    try {
      await db('reset_tokens').where('expiration_date', '<=', new Date()).delete();
      return;
    } catch (error) {
      throw error;
    }
  }
};