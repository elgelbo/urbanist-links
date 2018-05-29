require('dotenv').config({
  path: 'variables.env'
});
var
  Twitter = require('twitter'),
  mongoose = require('mongoose'),
  config = require('../config'),
  Tweet = require('../models/Tweet'),
  decay = require('../utils/decay');
const hhot = decay.hackerHot();
mongoose.Promise = global.Promise; //USE ES6 PROMISES see:http://mongoosejs.com/docs/promises.html#plugging-in-your-own-promises-library

// Connect to our mongo database
mongoose.connect(process.env.MONGODB_URI).then(
  () => {
    console.log('🔗 👌 🔗 👌 🔗 👌 🔗 👌 Mongoose connection open.')
  },
  err => {
    console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`)
  }
);

var twit = new Twitter(config.twitter);

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

async function go() {
  try {
    const tweets = await Tweet.find({});
    var i, j, temparray, chunk = 99;
    for (i = 0, j = tweets.length; i < j; i += chunk) {
      temp = tweets.slice(i, i + chunk);
      const Ids = [];
      temp.forEach((tweet) => {
        Ids.push(tweet.twid);
      });
      const statuses = await twit.get('statuses/lookup', {
        'id': Ids.toString()
      });
      await asyncForEach(statuses, async (tweet) => {
        var engage = tweet.retweet_count + tweet.favorite_count;
        var score = hhot(engage, new Date(tweet.created_at));
        const twt = await Tweet.findOneAndUpdate({
          twid: tweet.id_str
        }, { 'score': Number.parseFloat(score)})
      });
    }
    const top = await Tweet.find({}).limit(10).sort({
      score: -1
    });
    console.log(top);
    mongoose.connection.close();
  } catch (e) {
    console.error(e); // 💩
    mongoose.connection.close();
  }
}
// var handle = 'Matt_Gelbman';

go();



async function bestOf() {
  try {
    const top = await Tweet.find({}).limit(10).sort({
      score: -1
    });
    await asyncForEach(top, async (tweet) => {
      const list = await Tweet.findOneAndUpdate({
        twid: tweet.twid
      }, {
        top10: true
      }, {
        upsert: true
      }).exec();
    });
    mongoose.connection.close();
  } catch (e) {
    console.error(e); // 💩
    mongoose.connection.close();
  }
}
bestOf();
