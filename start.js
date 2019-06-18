const mongoose = require('mongoose');
require('dotenv').config();
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