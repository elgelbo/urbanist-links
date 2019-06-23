require('dotenv').config();
const mongoose = require('mongoose');
const tweets = require('./utils/tweets');
ids = require('./utils/idHandler')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, promiseLibrary: global.Promise}).then(
  () => { console.log('🔗 👌 🔗 👌 🔗 👌 🔗 👌 Mongoose connection open.') },
  err => { console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`) }
);
// IMPORT MODELS
require('./models/List');
require('./models/Tweet');

// START APP
const app = require('./app')

app.set('port', process.env.PORT || 7777 )

const server = app.listen(app.get('port'), () => {
  console.log(`👂 on PORT ${server.address().port}`);
});

// INIT SOCKET
const io = require('socket.io')(server);

ids.getStreamIDs().then(function (members) {
  tweets.createStream(io, members);
});