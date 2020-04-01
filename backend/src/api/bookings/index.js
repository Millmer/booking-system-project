const { Router } = require('express');
const router = new Router();
const { hasRole } = require('../auth/utils');
const controller = require('./controller');

/**
 * @api {get} /bookings      List all
 * @apiName GetAllBookings
 * @apiGroup Bookings
 * @apiPermission Host
*/
router.get('/', hasRole('HOST'), controller.list);

/**
 * @api {get} /bookings/cancel/:token      Cancel a booking
 * @apiName CancelBooking
 * @apiGroup Bookings
 * @apiPermission Guest
*/
router.get('/cancel/:token', controller.cancel);

/**
 * @api {post} /bookings/cancel      Cancel a booking with reason
 * @apiName CancelBookingWithReason
 * @apiGroup Bookings
 * @apiPermission Host
*/
router.post('/cancel', hasRole('HOST'), controller.cancelWithReason);

/**
 * @api {post} /bookings      Create a booking
 * @apiName CreateBooking
 * @apiGroup Bookings
 * @apiPermission Guest
*/
router.post('/', controller.create);

module.exports = router;