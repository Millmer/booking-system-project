const moment = require('moment');
const Booking = require('../persistence/bookings');
const Email = require('../email');

module.exports.sendBookingsOfTheDay = async () => {
  const now = moment();
  const morning = now.startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const night = now.endOf('day').format('YYYY-MM-DD HH:mm:ss');
  const aggragations = await Booking.aggregateDailyBookings(morning, night);
  aggragations.forEach(aggregate => {
    const email_info = {
      host_full_name: aggregate.host_name,
      number_of_bookings_on_current_date: aggregate.booking_count,
      time_of_earliest_booking: moment(aggregate.first_booking_date).format('HH:mm'),
      location_name: aggregate.location_name,
      dashboard_link: `${process.env.FRONTEND_PATH}/cms/calendar`
    }

    Email.send(aggregate.host_email, 'bookings-of-the-day', email_info).catch(error => {
      console.error(`Error sending booking of the day email to ${aggregate.host_email}`);
      console.error(error);
    });
  });
};

module.exports.sendBookingReminders = async () => {
  const twoDaysFromNow = moment().add(2, 'days');
  const morning = twoDaysFromNow.startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const night = twoDaysFromNow.endOf('day').format('YYYY-MM-DD HH:mm:ss');
  const bookings = await Booking.listBookingsForReminders(morning, night);

  bookings.forEach(booking => {
    const booking_date = moment(booking.date);
    const email_info = {
      full_name: booking.customer_name,
      booking_number: booking.booking_code,
      number_booked_kayaks: Math.floor((booking.number_of_people / 2)) + (booking.number_of_people % 2),
      is_plural_kayak: (booking.number_of_people > 2) ? 's' : '',
      number_of_volunteers: booking.number_of_people,
      is_plural_volunteer: (booking.number_of_people > 1) ? 's' : '',
      date_of_booking: booking_date.format('dddd, MMMM Do YYYY'),
      start_time_of_booking: booking_date.format('HH:mm'),
      duration_of_booking: moment.duration(booking.duration).humanize(),
      location_address: `${booking.name}, ${booking.address}`,
      google_maps_location_link: booking.maps_url,
      site_specific_information: booking.email_description || "Have a good time!",
      cancellation_link: `${process.env.ROOT_API_PATH}/bookings/cancel/${booking.cancellation_token}`
    };

    Email.send(booking.customer_email, 'booking-reminder', email_info).catch(error => {
      console.error(`Error sending booking of the day email to ${booking.customer_email}`);
      console.error(error);
    });
  });
};

module.exports.sendPostBookingEmails = async () => {
  const now = moment().subtract(1, 'hour');
  const start = now.startOf('hour').format('YYYY-MM-DD HH:mm:ss');
  const end = now.endOf('hour').format('YYYY-MM-DD HH:mm:ss');
  const bookings = await Booking.findCompletedBookings(start, end);
  bookings.forEach(async booking => {
    const email_info = {
      full_name: booking.name
    }

    Email.send(booking.email, 'post-booking-mail', email_info).catch(error => {
      console.error(`Error sending booking of the day email to ${booking.email}`);
      console.error(error);
    });

    await Booking.update(booking.id, { status: 'COMPLETED' });
  });
};