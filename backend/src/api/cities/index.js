const { Router } = require('express');
const router = new Router();
const { hasRole } = require('../auth/utils');
const controller = require('./controller');

/**
 * @api {get} /cities      List All
 * @apiName ListAllCities
 * @apiGroup Cities
 * @apiPermission Host
*/
router.get('/', hasRole('HOST'), controller.list);

/**
 * @api {get} /cities/:id      Get Single City
 * @apiName GetSingleCity
 * @apiGroup Cities
 * @apiPermission Host
*/
router.get('/:id', hasRole('HOST'), controller.get);

/**
 * @api {post} /cities      Create City
 * @apiName CreateCities
 * @apiGroup Cities
 * @apiPermission Admin
*/
router.post('/', hasRole('ADMIN'), controller.create);

/**
 * @api {put} /cities      Edit City
 * @apiName EditCity
 * @apiGroup Cities
 * @apiPermission Admin
*/
router.put('/:id', hasRole('ADMIN'), controller.edit);

/**
 * @api {delete} /cities      Delete City
 * @apiName DeleteCity
 * @apiGroup Cities
 * @apiPermission Admin
*/
router.delete('/:id', hasRole('ADMIN'), controller.destroy);

module.exports = router;