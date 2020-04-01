const { Router } = require('express');
const router = new Router();
const { hasRole } = require('../auth/utils');
const controller = require('./controller');

/**
 * @api {get} /countries      List All Countries
 * @apiName ListAllCountries
 * @apiGroup Countries
 * @apiPermission Host
*/
router.get('/', hasRole('HOST'), controller.list);

/**
 * @api {get} /countries/:id      Get Single Country
 * @apiName GetSingleCountry
 * @apiGroup Countries
 * @apiPermission Host
*/
router.get('/:id', hasRole('HOST'), controller.get);

/**
 * @api {post} /countries      Create Country
 * @apiName CreateCountry
 * @apiGroup Countries
 * @apiPermission Admin
*/
router.post('/', hasRole('ADMIN'), controller.create);

/**
 * @api {put} /countries/:id      Edit Country
 * @apiName EditCountry
 * @apiGroup Countries
 * @apiPermission Admin
*/
router.put('/:id', hasRole('ADMIN'), controller.edit);

/**
 * @api {delete} /country/:id      Delete Country
 * @apiName DeleteCountry
 * @apiGroup Countries
 * @apiPermission Admin
*/
router.delete('/:id', hasRole('ADMIN'), controller.destroy);

module.exports = router;