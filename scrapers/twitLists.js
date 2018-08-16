require('dotenv').config({
  path: 'variables.env'
});
var
  Twitter = require('twitter'),
  mongoose = require('mongoose'),
  moment = require('moment'),
  config = require('../config'),
  List = require('../models/List'),
  Tweet = require('../models/Tweet');
  mongoose.Promise = global.Promise; //USE ES6 PROMISES see:http://mongoosejs.com/docs/promises.html#plugging-in-your-own-promises-library
  
  
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

async function go(handle) {
  try {
    const lists = await twit.get('lists/list', {
      'id': handle
    });
    const Ids = [];
    lists.forEach((list) => {
      Ids.push(list.id_str);
    });
    const Users = [];
    await asyncForEach(Ids, async (list) => {
      const users = await twit.get('lists/members', {
        'list_id': list
      });
      Users.push(users.users);
    });
    const u = [];
    Users.forEach((group) => {
      group.forEach((user) => {
        u.push(user.id_str)
      })
    });
    const list = await List.findOneAndUpdate({
      user: handle
    }, {
      lists: Ids,
      members: u
    }, {
      new: true,
      upsert: true
    }).exec();
    console.log(list);
    mongoose.connection.close();
  } catch (e) {
    console.error(e); // 💩
    mongoose.connection.close();
  }
}
var handle = 'Matt_Gelbman';

go(handle);

async function delOld() {
  try {
    const bottom = await Tweet.find({
      top10: null
    });
    await asyncForEach(bottom, async (tweet) => {
      var created = moment(tweet.date);
      var now = moment(now);
      var weekAgo = now.subtract(7, 'days');
      if (created.isBefore(weekAgo, 'week') === true) {
        console.log('me is true');
      } else {
        console.log('falsey falsey');
        console.log(tweet.twid);
        var doc = await Tweet.findOneAndDelete({
          twid: tweet.twid
        });
        // var doc = Tweet.findOneAndRemove({'twid': tweet.twid});
        console.log(doc);
      }
    });
    mongoose.connection.close();
  } catch (e) {
    console.error(e); // 💩
    mongoose.connection.close();
  }
}
delOld();
