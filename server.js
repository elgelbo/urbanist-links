require('dotenv').config({
  path: 'variables.env'
});
var express = require('express'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  validator = require('express-validator'),
  path = require('path'),
  routes = require('./routes/index'),
  ids = require('./utils/idHandler'),
  config = require('./config'),
  streamHandler = require('./utils/streamHandler'),
  Twitter = require('twitter'),
  errorHandlers = require('./handlers/errorHandlers');

mongoose.Promise = global.Promise; //USE ES6 PROMISES see:http://mongoosejs.com/docs/promises.html#plugging-in-your-own-promises-library

// CREATE EXPRESS APP
var app = express();
// SET PORT FOR APP
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

// PUG AS VIEW ENGINE + PRETTY PRINT FOR DEV ENV.
app.set('view engine', 'pug')
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}
// Disable etag headers on responses
app.disable('etag');

// CONNECT TO DB
mongoose.connect(process.env.MONGODB_URI).then(
  () => {
    console.log('🔗 👌 🔗 👌 🔗 👌 🔗 👌 Mongoose connection open.')
  },
  err => {
    console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`)
  }
);
// Exposes a bunch of methods for validating data. Used heavily on userController.validateRegister
app.use(validator());
// Index Route
app.use('/', routes);
// Set /public as our static content dir
app.use("/", express.static(path.join(__dirname, 'public')));
// ERROR HANDLING - RETURN 404 and forward to error handler
app.use(errorHandlers.notFound);
// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);
// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}
// production error handler
app.use(errorHandlers.productionErrors);

var twit = new Twitter(config.twitter);

// Initialize socket.io
var io = require('socket.io').listen(server);
io.on('connection', function (socket) {
  console.log('a user connected');
});
ids.getStreamIDs().then(function (members) {
  twit.stream('statuses/filter', { follow: members }, function (stream) {
    stream.on('data', function (event) {
      streamHandler(event, io);
    });
    stream.on('error', function (error) {
      throw error;
    });
  });
});