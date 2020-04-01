const uuid = require('uuid');
const moment = require('moment');
const Customer = require('../../persistence/customers');
const Booking = require('../../persistence/bookings');
const Location = require('../../persistence/locations');
const Email = require('../../email');

module.exports = {
  async list(req, res) {
    try {
      var { start, end } = req.query;
      if (!start) {
        start = moment().startOf('month').format('YYYY-MM-DD'); // Don't show bookings older than start of this month
        end = moment().startOf('month').add(6, 'months').format('YYYY-MM-DD') // Auto lookup 6 months in advance
      }
      const bookings = (req.user.role === 'HOST') ? await Booking.listForHost(req.user.id, start, end) : await Booking.list(start, end);
      bookings.forEach(booking => {
        const start = moment(booking.date).utc(0);
        const duration = moment.duration(booking.duration);
        const end = start.clone().add(duration);
        Object.assign(booking, {
          colour: stringToColour(booking.name),
          start: start.format('YYYY-MM-DD HH:mm'),
          end: end.format('YYYY-MM-DD HH:mm')
        });
      });

      res.status(200).json(bookings);
    } catch (error) {
      console.error(error);
      res.status(500).json();
    }
  },
  async cancel(req, res) {
    try {
      const token = req.params.token;
      if (!token) return res.status(400).json({ message: 'Cancellation token is required' });

      const booking = await Booking.getByCancellationToken(token);
      const customer = await Customer.get(booking.customer_id);
      await Booking.update(booking.id, { status: 'CANCELLED' });
      const email_info = {
        full_name: customer.name,
        booking_number: booking.booking_code,
        date_of_booking: moment(booking.date).format('dddd, MMMM Do YYYY, HH:mm'),
        reason_for_cancellation: ''
      }

      // Here we await the email so that we can return the sent HTML to the user
      const HTML = await Email.send(customer.email, 'booking-cancellation', email_info).catch(error => {
        console.error(`Error sending booking cancellation email for ${booking.booking_code}`);
        console.error(error);
      });
      return res.status(200).send(HTML);
    } catch (error) {
      if (typeof error === 'string' && error.includes('NOT_FOUND')) return res.status(404).json({ message: error });
      console.error(`cancelBooking >> Error: ${error.stack}`);
      return res.status(500).json();
    }
  },
  async cancelWithReason(req, res) {
    try {
      const { token, reason } = req.body;
      if (!token) return res.status(400).json({ message: 'Cancellation token is required' });
      if (!reason) return res.status(400).json({ message: 'Cancellation reason is required' });

      const booking = await Booking.getByCancellationToken(token);
      const customer = await Customer.get(booking.customer_id);
      await Booking.update(booking.id, { status: 'CANCELLED' });
      const email_info = {
        full_name: customer.name,
        booking_number: booking.booking_code,
        date_of_booking: moment(booking.date).format('dddd, MMMM Do YYYY, HH:mm'),
        reason_for_cancellation: reason
      }

      Email.send(customer.email, 'booking-cancellation', email_info).catch(error => {
        console.error(`Error sending booking cancellation email for ${booking.booking_code}`);
        console.error(error);
      });
      return res.status(204).json();
    } catch (error) {
      if (typeof error === 'string' && error.includes('NOT_FOUND')) return res.status(404).json({ message: error });
      console.error(`cancelBooking >> Error: ${error.stack}`);
      return res.status(500).json();
    }
  },
  async create(req, res) {
    try {
      const { location_id, number_of_people, date, customer: { name, nationality, city_of_residence, country_of_residence, above_eighteen, telephone_number, email, gender, previous_experience } } = req.body;
      if (!name) return res.status(400).json({ message: 'Name is required' });
      if (!nationality) return res.status(400).json({ message: 'Nationality is required' });
      if (!city_of_residence) return res.status(400).json({ message: 'City of residence required' });
      if (!country_of_residence) return res.status(400).json({ message: 'Country of residence is required' });
      if (!above_eighteen) return res.status(400).json({ message: 'Volunteer must be above eighteen to hire a kayak' });
      if (!telephone_number) return res.status(400).json({ message: 'Telephone number is required' });
      if (!email) return res.status(400).json({ message: 'Email is required' });
      if (!location_id) return res.status(400).json({ message: 'Location is required' });
      if (!number_of_people) return res.status(400).json({ message: 'Number of people is required' });
      if (!date) return res.status(400).json({ message: 'Date is required' });
      const location = await Location.get(location_id);

      const [booking_code] = uuid().split('-');
      const customer = await Customer.create({ name, nationality, city_of_residence, country_of_residence, above_eighteen, telephone_number, email, gender, previous_experience });
      const booking = await Booking.create({ customer_id: customer.id, location_id, number_of_people, date, duration: location.default_booking_length, cancellation_token: uuid(), booking_code });
      
      const dateTime = moment(date);
      const number_booked_kayaks = Math.floor((number_of_people / 2)) + (number_of_people % 2);
      const email_info = {
        full_name: name,
        booking_number: booking_code,
        number_booked_kayaks,
        is_plural_kayak: (number_booked_kayaks > 1) ? 's' : '',
        number_of_volunteers: number_of_people,
        is_plural_volunteer: (number_of_people > 1) ? 's' : '',
        date_of_booking: dateTime.format('dddd, MMMM Do YYYY'),
        start_time_of_booking: dateTime.format('HH:mm'),
        duration_of_booking: moment.duration(location.default_booking_length).humanize(),
        location_address: `${location.name}, ${location.address}`,
        google_maps_location_link: location.maps_url,
        site_specific_information: location.email_description || location.description || "Have a good time!",
        cancellation_link: `${process.env.ROOT_API_PATH}/bookings/cancel/${booking.cancellation_token}`
      };
      Email.send(email, 'booking-confirmation', email_info).catch(error => {
        console.error(`Error sending booking confirmation email for ${booking.booking_code}`);
        console.error(error);
      });

      return res.status(200).json(booking);
    } catch (error) {
      if (typeof error === 'string' && error.includes('NOT_FOUND')) return res.status(404).json({ message: error });
      console.error(`createBooking >> Error: ${error.stack}`);
      res.status(500).json();
    }
  }
};

var stringToColour = function (str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}