var Tweet = require('../models/Tweet');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise; //USE ES6 PROMISES see:http://mongoosejs.com/docs/promises.html#plugging-in-your-own-promises-library

// async function asyncForEach(array, callback) {
//   for (let index = 0; index < array.length; index++) {
//     await callback(array[index], index, array)
//   }
// }

async function save(tweet) {
  try {
    const twt = await Tweet.findOneAndUpdate({
      twid: tweet.twid
    }, {
      twid: tweet.twid,
      author: tweet.author,
      body: tweet.body,
      date: tweet.date,
      urls: tweet.urls
    }, {
      new: true,
      upsert: true
    }).exec();
    console.log('Saved:' + twt);
  } catch (e) {
    console.error(e); // 💩
  }
}

saveTweet = async (tweet)=> {
  // console.log(tweet);
  if (tweet.extended_tweet) {
    console.log('has extended');
    const Urls = [];
    tweet.entities.urls.forEach((url)=> {
      Urls.push(url.expanded_url)
    });
    var tw = {
      twid: tweet.id_str,
      author: tweet.user.id_str,
      body: tweet.extended_tweet.full_text,
      date: tweet.created_at,
      urls: Urls
    };
    save(tw);
  } else {
    console.log('not extended');
    const Urls = [];
    tweet.entities.urls.forEach((url)=> {
      Urls.push(url.expanded_url)
    });
    var tw = {
      twid: tweet.id_str,
      author: tweet.user.id_str,
      body: tweet.text,
      date: tweet.created_at,
      urls: Urls
    };
    save(tw);
  }
}

module.exports = function(data, io) {
  if (data['user'] !== undefined) {
    console.log('RETWEET? = ' + data.retweeted_status);
    console.log('QUOTE? = ' + data.is_quote_status);
    if ((data.retweeted_status) && (data.is_quote_status === false)) {
      console.log('RT + NO QT');
      saveTweet(data.retweeted_status);
    } else if ((data.retweeted_status) && (data.is_quote_status === true)) {
      console.log('RT + QT');
      saveTweet(data.retweeted_status);
      saveTweet(data.quoted_status);
    } else if ((typeof(data.retweeted_status) === "undefined") && (data.is_quote_status === true)) {
      console.log('NO RT + QT: ' + data.id_str);
    } else if ((data.is_quote_status === false) && (typeof(data.retweeted_status) === "undefined")) {
      console.log('NO RT + NO QT: ' + data.id_str);
      saveTweet(data);
    } else {
      console.log('UNKNOWN: ' + data.id_str);
    }
    console.log('--------------------------------');
    io.emit('news', {
      data
    });
  }
};
