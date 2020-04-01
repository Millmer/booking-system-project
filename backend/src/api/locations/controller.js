const Location = require('../../persistence/locations');
const Country = require('../../persistence/countries');
const City = require('../../persistence/cities');
const Booking = require('../../persistence/bookings');
const moment = require('moment');

module.exports = {

  async list(req, res) {
    try {
      const locations = (req.user.role === 'HOST') ? await Location.listForHost(req.user.id) : await Location.list();

      return res.status(200).json(locations);
    } catch (error) {
      console.error(`listLocations >> Error: ${error.stack}`);
      res.status(500).json();
    }
  },
  async listCountries(req, res) {
    try {
      const countries = await Country.list();

      return res.status(200).json(countries);
    } catch (error) {
      console.error(`listLocationCountries >> Error: ${error.stack}`);
      res.status(500).json();
    }
  },
  async listCities(req, res) {
    try {
      const countryId = req.params.country_id;
      if (!countryId) {
        return res.status(400).json({ message: 'CountryId must be provided' });
      }
      const cities = await Country.listCities(countryId);

      return res.status(200).json(cities);
    } catch (error) {
      console.error(`listLocationCitiesForCountry >> Error: ${error.stack}`);
      res.status(500).json();
    }
  },
  async listLocations(req, res) {
    try {
      const countryId = req.params.country_id;
      if (!countryId) {
        return res.status(400).json({ message: 'CountryId must be provided' });
      }

      const cityId = req.params.city_id;
      if (!cityId) {
        return res.status(400).json({ message: 'CityId must be provided' });
      }

      const locations = await City.listLocations(cityId);

      return res.status(200).json(locations);
    } catch (error) {
      console.error(`listLocationsForCityAndCountry >> Error: ${error.stack}`);
      res.status(500).json();
    }
  },
  async listAvailableTimes(req, res) {
    try {
      const { country_id, city_id, location_id, from, to } = req.params;
    
      if (!country_id) {
        return res.status(400).json({ message: 'CountryId must be provided' });
      }

      if (!city_id) {
        return res.status(400).json({ message: 'CityId must be provided' });
      }

      if (!location_id) {
        return res.status(400).json({ message: 'LocationId must be provided' });
      }

      if (!from || !to) {
        return res.status(400).json({ message: 'From and To dates must be provided' });
      }

      let fromDate = moment(from);
      let toDate = moment(to);
      const location = await Location.get(location_id);
      const bookings = await Booking.getByDateAndLocation(location_id, [fromDate.startOf('day').format('YYYY-MM-DD HH:mm:ss'), toDate.endOf('day').format('YYYY-MM-DD HH:mm:ss')]);
      const availableTimes = {};

      // Set time helper, accepts time string like HH:mm
      Object.getPrototypeOf(moment()).setTime = function(time) {
        const [hour, minute] = time.split(':');
        return this.set({hour, minute});
      };

      // Generates all dates between from-to (inclusive)
      for (let day = fromDate; day.isSameOrBefore(toDate); day.add(1, 'd')) {
        // Check location blocked days
        if (location.blocked_days && location.blocked_days.length > 0) {
          const ranges = location.blocked_days.filter(blocker => blocker.key === 'range').map(blocker => blocker.range);
          let isBlocked = false;
          for (let i = 0; i < ranges.length; i++) {
            const [start, end] = ranges[i];
            if (day.isBetween(moment(start), moment(end), 'day', '[]')) {
              isBlocked = true;
              break;
            }
          }
          if (isBlocked) continue;
        }

        // Check location for closed days
        const currentWeekday = day.format('dddd').toLowerCase();
        if (!location.opening_hours[currentWeekday].length) continue;

        // Helper variables
        const availableSlots = [];
        const bookingsOnCurrentDate = bookings.filter(booking => moment(booking.date).isSame(day, 'day'));
        const weekdayOpeningHours = location.opening_hours[currentWeekday];

        // Calculate slots inside current day's opening hours
        weekdayOpeningHours.forEach(openingSlot => {
          const [openTime, closeTime] = openingSlot.split('~');
          const slotSpacing = moment.duration("00:15:00"); // Assume 15 mins between bookings
          const slotLength = moment.duration(location.default_booking_length);
          const openDate = day.clone().setTime(openTime);
          const closeDate = day.clone().setTime(closeTime);
          for (let slotStart = openDate; slotStart.isSameOrBefore(closeDate); slotStart.add(slotSpacing)) {
            const slotEnd = slotStart.clone().add(slotLength);
            let available_kayaks = location.kayak_number;

            // Check if any bookings conflict with generated slot
            if (bookingsOnCurrentDate.length) {
              bookingsOnCurrentDate.forEach(booking => {
                const bookingStart = moment(booking.date);
                const bookingDuration = moment.duration(booking.duration);
                const bookingEnd = bookingStart.clone().add(bookingDuration);
                if (bookingStart.isBetween(slotStart, slotEnd, 'minute', '[)') || bookingEnd.isBetween(slotStart, slotEnd, 'minute', '(]')) {
                  available_kayaks -= Math.floor((booking.number_of_people / 2)) + (booking.number_of_people % 2);
                }
              });
            }

            // Add slot if it doesn't go beyond closing and there are kayaks left
            if (slotEnd <= closeDate && available_kayaks > 0) availableSlots.push({ start: slotStart.format('HH:mm:ss'), end: slotEnd.format('HH:mm:ss'), available_kayaks });
          }
        });
        availableTimes[day.format('YYYY-MM-DD')] = availableSlots;
      }

      return res.status(200).json(availableTimes);

    } catch (error) {
      console.error(`listAvailableTimesForLocationAndCityAndCountry >> Error: ${error.stack}`);
      res.status(500).json();
    }
  },
  async get(req, res) {
    try {
      const locationId = req.params.id;
      if (!locationId) {
        return res.status(400).json({ message: 'LocationId must be provided' });
      }

      const location = await Location.get(locationId);

      return res.status(200).json(location);
    } catch (error) {
      console.error(`getLocation({ id: ${req.params.id} }) >> Error: ${error.stack}`);
      res.status(500).json();
    }
  },
  async create(req, res) {
    try {
      const { city_id, host_id, name, address, image_url, kayak_number, default_booking_length, opening_hours, description, email_description, maps_url, maps_iframe, trash_collected_kg } = req.body;
      if (!city_id || !host_id || !name || !address || !image_url || !kayak_number || !default_booking_length || !opening_hours) {
        return res.status(400).json({ message: 'Missing fields must be provided' });
      }

      const blocked_days = JSON.stringify(req.body.blocked_days);

      const location = await Location.create({ city_id, host_id, name, address, image_url, kayak_number, default_booking_length, opening_hours, blocked_days, description, email_description, maps_url, maps_iframe, trash_collected_kg });
      if (!location) {
        return res.status(400).json({ message: 'Location already exists' });
      }

      return res.status(200).json(location);
    } catch (error) {
      console.error(`createLocation({ name: ${req.body.name} }) >> Error: ${error.stack}`);
      res.status(500).json();
    }
  },
  async edit(req, res) {
    try {
      const locationId = req.params.id;
      if (!locationId) {
        return res.status(400).json({ message: 'LocationId must be provided' });
      }

      const { city_id, host_id, name, address, image_url, kayak_number, default_booking_length, opening_hours, description, email_description, maps_url, maps_iframe, trash_collected_kg } = req.body;
      if (!city_id || !host_id || !name || !address || !image_url || !kayak_number || !default_booking_length || !opening_hours) {
        return res.status(400).json({ message: 'Missing fields must be provided' });
      }

      const blocked_days = JSON.stringify(req.body.blocked_days);

      const location = await Location.update(locationId, { city_id, host_id, name, address, image_url, kayak_number, default_booking_length, opening_hours, blocked_days, description, email_description, maps_url, maps_iframe, trash_collected_kg });

      return res.status(200).json(location);
    } catch (error) {
      console.error(`editLocation({ id: ${req.params.id} }) >> Error: ${error.stack}`);
      res.status(500).json();
    }
  },
  async destroy(req, res) {
    try {
      const locationId = req.params.id;
      if (!locationId) {
        return res.status(400).json({ message: 'LocationId must be provided' });
      }

      const location = await Location.destroy(locationId);

      return res.status(200).json(location);
    } catch (error) {
      console.error(`deleteLocation({ id: ${req.params.id} }) >> Error: ${error.stack}`);
      res.status(500).json();
    }
  }
};