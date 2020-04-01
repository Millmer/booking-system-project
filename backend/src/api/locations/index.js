const { Router } = require('express');
const router = new Router();
const { hasRole } = require('../auth/utils');
const controller = require('./controller');

/**
 * @api {get} /locations      List All
 * @apiName ListAllLocations
 * @apiGroup Locations
 * @apiPermission Host
*/
router.get('/', hasRole('HOST'), controller.list);

/**
 * @api {get} /locations/countries      List All Countries
 * @apiName ListAllLocationCountries
 * @apiGroup Locations
 * @apiPermission Guest
*/
router.get('/countries', controller.listCountries);

/**
 * @api {get} /locations/:id      Get Single Location
 * @apiName GetSingleLocation
 * @apiGroup Locations
 * @apiPermission Host
*/
router.get('/:id', hasRole('HOST'), controller.get);

/**
 * @api {get} /locations/:country_id/cities      List All Cities for given Country
 * @apiName ListAllLocationCitiesForCountry
 * @apiGroup Locations
 * @apiPermission Guest
*/
router.get('/:country_id/cities', controller.listCities);

/**
 * @api {get} /locations/:country_id/:city_id      List All Locations for given City & Country
 * @apiName ListAllLocationsForCityAndCountry
 * @apiGroup Locations
 * @apiPermission Guest
*/
router.get('/:country_id/:city_id', controller.listLocations);

/**
 * @api {get} /locations/:country_id/:city_id/:location_id/dates/:from/:to   List All Available Times for given Location, City & Country in dates
 * @apiName ListAllTimesForLocationAndCityAndCountry
 * @apiGroup Locations
 * @apiPermission Guest
*/
router.get('/:country_id/:city_id/:location_id/dates/:from/:to', controller.listAvailableTimes);

/**
 * @api {post} /locations      Create Location
 * @apiName CreateLocation
 * @apiGroup Locations
 * @apiPermission Host
*/
router.post('/', hasRole('HOST'), controller.create);

/**
 * @api {put} /locatinos/:id      Edit Location
 * @apiName EditLocation
 * @apiGroup Locations
 * @apiPermission Host
*/
router.put('/:id', hasRole('HOST'), controller.edit);

/**
 * @api {delete} /locations/:id      Delete Location
 * @apiName DeleteLocation
 * @apiGroup Locations
 * @apiPermission Host
*/
router.delete('/:id', hasRole('HOST'), controller.destroy);

module.exports = router;