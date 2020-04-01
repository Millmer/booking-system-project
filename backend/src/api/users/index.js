const { Router } = require('express');
const router = new Router();
const { hasRole } = require('../auth/utils');
const controller = require('./controller');

/**
 * @api {get} /users      List All
 * @apiName ListAllUsers
 * @apiGroup Users
 * @apiPermission Host
*/
router.get('/', hasRole('HOST'), controller.list);

/**
 * @api {get} /users/:id      Get Single User
 * @apiName GetSingleUser
 * @apiGroup Users
 * @apiPermission Host
*/
router.get('/:id', hasRole('HOST'), controller.get);

/**
 * @api {post} /users      Create User
 * @apiName CreateUser
 * @apiGroup Users
 * @apiPermission Admin
*/
router.post('/', hasRole('ADMIN'), controller.create);

/**
 * @api {put} /users/:id      Edit User
 * @apiName EditUser
 * @apiGroup Users
 * @apiPermission Host
*/
router.put('/:id', hasRole('HOST'), controller.edit);

/**
 * @api {delete} /users/:id      Delete User
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiPermission Admin
*/
router.delete('/:id', hasRole('ADMIN'), controller.destroy);

module.exports = router;