require('dotenv').config();
const mongoose = require('mongoose');
const Twitter = require('twitter')

// IMPORT MONGOOSE

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, promiseLibrary: global.Promise}).then(
  () => { console.log('🔗 👌 🔗 👌 🔗 👌 🔗 👌 Mongoose connection open.') },
  err => { console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`) }
);
// IMPORT MODELS

// START APP
const app = require('./app')
app.set('port', process.env.PORT || 7777 )

const server = app.listen(app.get('port'), () => {
  console.log(`👂 on PORT ${server.address().port}`);
});

const io = require('socket.io')(server);

var client = new Twitter({
  consumer_key: '81mgcaZfRjMs7d5ouASM4OOW7',
  consumer_secret: 'Qrlz323G4i2hLnhuOx1IDCAUsT0YjWdmHJCHfpt8v4n5N5xPel',
  access_token_key: '1433866686-3JH42zlnHj1eup6aAlr7IRNgjg3KDM5UXbZtetP',
  access_token_secret: 'eySak7lkqT70G2uDImgWRYWGAPgLGrYkcvks5icwviMyH'
});

const stream = client.stream('statuses/filter', { track: 'nodejs,angular' });

stream.on('data', function(event) {
  console.log(event && event.text);
  io.emit('tweets', event);
});

stream.on('error', function(error) {
  throw error;
});