require('dotenv').config({
  path: 'variables.env'
});
var express = require('express'),
  mongoose = require('mongoose'),
  Twitter = require('twitter'),
  routes = require('./routes/index'),
  ids = require('./utils/idHandler'),
  config = require('./config'),
  streamHandler = require('./utils/streamHandler');
mongoose.Promise = global.Promise; //USE ES6 PROMISES see:http://mongoosejs.com/docs/promises.html#plugging-in-your-own-promises-library

// Create an express instance and set a port variable
var app = express();
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

// Set pug as the templating engine
app.set('view engine', 'pug')

// Disable etag headers on responses
app.disable('etag');

// Connect to our mongo database
mongoose.connect(process.env.MONGODB_URI).then(
  () => {
    console.log('🔗 👌 🔗 👌 🔗 👌 🔗 👌 Mongoose connection open.')
  },
  err => {
    console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`)
  }
);
// Create a new twitter instance
var twit = new Twitter(config.twitter);
// Index Route
app.use('/', routes);
// Set /public as our static content dir
app.use("/", express.static(__dirname + "/public/"));



// Initialize socket.io
var io = require('socket.io').listen(server);
io.on('connection', function (socket) {
  console.log('a user connected');
});

ids.getStreamIDs().then(function (members) {
  twit.stream('statuses/filter', { follow: members }, function (stream) {
    stream.on('data', function (event) {
      // console.log(event && event.text);
      streamHandler(event, io);
    });
    stream.on('error', function (error) {
      throw error;
    });
  });
});