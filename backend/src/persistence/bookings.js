const db = require('./db');

module.exports = {
  async list(start, end) {
    try {
      const rows = await db.select(
        ['bookings.*',
        'locations.name',
        'customers.name AS customer_name',
        'customers.email AS customer_email',
        'customers.telephone_number AS customer_number',
        'users.id AS host_id',
        'users.email AS host_email',
        'countries.id AS country_id', 'countries.code'])
      .table('bookings')
      .innerJoin('locations', 'bookings.location_id', 'locations.id')
      .innerJoin('customers', 'bookings.customer_id', 'customers.id')
      .innerJoin('users', 'locations.host_id', 'users.id')
      .innerJoin('cities', 'locations.city_id', 'cities.id')
      .innerJoin('countries', 'cities.country_id', 'countries.id')
      .whereBetween('bookings.date', [start, end])
      .orderBy('bookings.date', 'desc');
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async listForHost(host_id, start, end) {
    try {
      const rows = await db.select(
        ['bookings.*',
        'locations.name',
        'customers.name AS customer_name',
        'customers.email AS customer_email',
        'customers.telephone_number AS customer_number',
        'users.id AS host_id',
        'users.email AS host_email',
        'countries.id AS country_id', 'countries.code'])
      .table('bookings')
      .innerJoin('locations', 'bookings.location_id', 'locations.id')
      .innerJoin('customers', 'bookings.customer_id', 'customers.id')
      .innerJoin('users', 'locations.host_id', 'users.id')
      .innerJoin('cities', 'locations.city_id', 'cities.id')
      .innerJoin('countries', 'cities.country_id', 'countries.id')
      .whereBetween('bookings.date', [start, end])
      .andWhere('locations.host_id', host_id)
      .orderBy('bookings.date', 'desc');
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async listBookingsForReminders(morning, night) {
    try {
      const rows = await db.select(
        ['bookings.booking_code', 'bookings.date', 'bookings.duration', 'bookings.number_of_people', 'bookings.cancellation_token', 
        'locations.name', 'locations.address', 'locations.maps_url', 'locations.email_description',
        'customers.name AS customer_name',
        'customers.email AS customer_email'])
      .table('bookings')
      .innerJoin('locations', 'bookings.location_id', 'locations.id')
      .innerJoin('customers', 'bookings.customer_id', 'customers.id')
      .whereBetween('bookings.date', [morning, night])
      .andWhere('bookings.status', 'CREATED')
      .orderBy('bookings.date', 'desc');
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async findCompletedBookings(start, end) {
    try {
      const rows = await db.select(
        ['bookings.id', 
        'customers.name', 'customers.email'])
      .table('bookings')
      .innerJoin('customers', 'bookings.customer_id', 'customers.id')
      .whereRaw('(bookings.date + bookings.duration) BETWEEN ? AND ?', [start, end])
      .andWhere('bookings.status', 'CREATED')
      .orderBy('bookings.date', 'desc');
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async aggregateDailyBookings(morning, night) {
    try {
      const result = await db.raw(`
        SELECT DISTINCT ON (l.id)
        COUNT(*) OVER(PARTITION by l.id) as booking_count,
        CONCAT(u.first_name, ' ', u.last_name) AS host_name,
        u.email AS host_email,
        l.name AS location_name,
        b.date AS first_booking_date
        FROM bookings b
        INNER JOIN locations l ON b.location_id = l.id
        INNER JOIN users u ON u.id = l.host_id
        WHERE b.date BETWEEN ? AND ?
        AND u.role = 'HOST'
        AND u.do_send_daily_booking_email = 'TRUE'
        ORDER BY l.id, b.date ASC;
      `, [morning, night]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
  async getByDateAndLocation(location_id, range) {
    try {
      const rows = await db('bookings').where({location_id}).andWhereBetween("date", range).andWhereNot('status', 'CANCELLED');
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async get(id) {
    try {
      let rows = await db('bookings').where({ id });
      if (!rows || !rows.length) throw 'BOOKING_NOT_FOUND';
      const booking = rows[0];
      return booking;
    } catch (error) {
      throw error;
    }
  },
  async getByDate(date) {
    try {
      let rows = await db('bookings').where({ date });
      if (!rows || !rows.length) throw 'NO_BOOKINGS_FOR_' + date;
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getByCancellationToken(cancellation_token) {
    try {
      let rows = await db('bookings').where({ cancellation_token }).andWhere('status', 'CREATED');
      if (!rows || !rows.length) throw 'BOOKING_NOT_FOUND';
      const booking = rows[0];
      return booking;
    } catch (error) {
      throw error;
    }
  },
  async create(booking) {
    try {
      const bookingId = await db('bookings').returning('id').insert(booking);

      return Object.assign(booking, { id: bookingId[0] });
    } catch (error) {
      throw error;
    }
  },
  async update(id, values) {
    try {
      const rows = await db('bookings').where({ id });
      if (!rows || !rows.length) throw 'BOOKING_NOT_FOUND';
      Object.assign(values, { updated_at: db.fn.now() });
      const booking = await db('bookings').where({ id }).update(values, [...Object.keys(values), 'id']);
      return booking[0];
    } catch (error) {
      throw error;
    }
  },
  async destroy(id) {
    try {
      const rows = await db('bookings').where({ id });
      if (!rows || !rows.length) throw 'BOOKING_NOT_FOUND';
      await db('bookings').where({ id }).delete();
      const booking = rows[0];
      return booking;
    } catch (error) {
      throw error;
    }
  }
};