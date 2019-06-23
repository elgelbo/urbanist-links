const Twitter = require('twitter');
var Tweet = require('../models/Tweet');
var mongoose = require('mongoose');
async function save(tweet, io) {
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
    io.emit('tweets',
    twt
  );
  } catch (e) {
    console.error(e); // 💩
  }
}

saveTweet = async (io, tweet) => {

  if (tweet.extended_tweet) {
    console.log('has extended');
    const Urls = [];
    tweet.entities.urls.forEach((url) => {
      Urls.push(url.expanded_url)
    });
    var tw = {
      twid: tweet.id_str,
      author: tweet.user.id_str,
      body: tweet.extended_tweet.full_text,
      date: tweet.created_at,
      urls: Urls
    };
    save(tw, io);
  } else {
    console.log('not extended');
    const Urls = [];
    tweet.entities.urls.forEach((url) => {
      Urls.push(url.expanded_url)
    });
    var tw = {
      twid: tweet.id_str,
      author: tweet.user.id_str,
      body: tweet.text,
      date: tweet.created_at,
      urls: Urls
    };
    save(tw, io);
  }
}

streamHandler = (tweet, io) => {
  if (tweet['user'] !== undefined) {
    console.log('RETWEET? = ' + tweet.retweeted_status);
    console.log('QUOTE? = ' + tweet.is_quote_status);
    if ((tweet.retweeted_status) && (tweet.is_quote_status === false)) {
      console.log('RT + NO QT');
      saveTweet(io, tweet.retweeted_status);
    }
    else if ((tweet.retweeted_status) && (tweet.is_quote_status === true)) {
      console.log('RT + QT');
      saveTweet(io, tweet.retweeted_status);
      saveTweet(io, tweet.quoted_status);
    }
    else if ((typeof (tweet.retweeted_status) === "undefined") && (tweet.is_quote_status === true)) {
      console.log('NO RT + QT: ' + tweet.id_str);
    }
    else if ((tweet.is_quote_status === false) && (typeof (tweet.retweeted_status) === "undefined")) {
      console.log('NO RT + NO QT: ' + tweet.id_str);
      saveTweet(io, tweet);
    }
    else {
      console.log('UNKNOWN: ' + tweet.id_str);
    }
    console.log('--------------------------------');
  }
};

exports.createStream = (io, members) => {
  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESSS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
  const stream = client.stream('statuses/filter', { follow: members });
  stream.on('data', function (event) {
    streamHandler(event, io);
  });
  stream.on('error', function (error) {
    throw error;
  });
};