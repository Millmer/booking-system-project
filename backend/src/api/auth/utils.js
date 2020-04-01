const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const roles = [
  'HOST',
  'ADMIN'  
];

//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (token, done) => done(null, token.user)));

module.exports.hasRole = function (roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');
  if (roles.indexOf(roleRequired) === -1) throw new Error(`${roleRequired} does not exist`);
  return [
    passport.authenticate('jwt', { session : false }),
    (req, res, next) => {
      if (req.user) {
        if (roles.includes(req.user.role) && roles.indexOf(req.user.role) >= roles.indexOf(roleRequired)) {
          next();
        } else {
          return res.status(403).send('Forbidden');
        }
      } else {
        return res.status(401).send('Unauthorized');
      }
    }
  ]
}