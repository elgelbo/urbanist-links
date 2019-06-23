const Twitter = require('twitter');
const processTweets = require('./processTweets');

exports.createSocket = (io) => {
  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESSS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
  
  const stream = client.stream('statuses/filter', { track: 'javascript' });
  
  stream.on('data', function (event) {
    processTweets.streamHandler(event, io);
  });
  
  stream.on('error', function (error) {
    throw error;
  });
  stream.on('error', function (error) {
    throw error;
  });
};