const { Router } = require('express');
const router = new Router();
const controller = require('./controller');

/**
 * @api {post} /auth/login      Login User
 * @apiName Login
 * @apiGroup Auth
 * @apiPermission Guest
*/
router.post('/login', controller.login);

/**
 * @api {post} /auth/forgot-password
 * @apiName ForgotPassword
 * @apiGroup Auth
 * @apiPermission Guest
*/
router.post('/forgot-password', controller.forgotPassword);

/**
 * @api {post} /auth/password-reset
 * @apiName PasswordReset
 * @apiGroup Auth
 * @apiPermission Guest
*/
router.post('/password-reset', controller.passwordReset);

 module.exports = router;