const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const logger = require('morgan');
const passport = require('passport');
const app = express();
const api = require('./src/api');
require('./src/cron');

// Logger
if (process.env.NODE_ENV === 'dev') app.use(logger('dev'));
else app.use(logger('combined'));

// Parser
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Basic security headers
app.use(helmet());

app.use(passport.initialize());
app.use(passport.session()); // Although session middleware is already attached to app above, passport only extends it. Hence, there is only one session.

// Basic cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

// Health checks
app.get('/', (req, res) => res.sendStatus(200));
app.get('/health', (req, res) => res.sendStatus(200));

// Load routes
app.use(api);

let server;
module.exports = {
  start(port) {
    server = app.listen(port, () => {
      console.log(`App started on port ${port}`);
    });
    return app;
  },
  stop() {
    server.close();
  }
};