exports.streamHandler = (tweet, io) => {
  // io.emit('tweets', tweet);









  if (tweet['user'] !== undefined) {
    console.log('RETWEET? = ' + tweet.retweeted_status);
    console.log('QUOTE? = ' + tweet.is_quote_status);
    if ((tweet.retweeted_status) && (tweet.is_quote_status === false)) {
      console.log('RT + NO QT');
      // saveTweet(tweet.retweeted_status);
    } else if ((tweet.retweeted_status) && (tweet.is_quote_status === true)) {
      console.log('RT + QT');
      // saveTweet(tweet.retweeted_status);
      // saveTweet(tweet.quoted_status);
    } else if ((typeof (tweet.retweeted_status) === "undefined") && (tweet.is_quote_status === true)) {
      console.log('NO RT + QT: ' + tweet.id_str);
    } else if ((tweet.is_quote_status === false) && (typeof (tweet.retweeted_status) === "undefined")) {
      console.log('NO RT + NO QT: ' + tweet.id_str);
      // saveTweet(tweet);
    } else {
      console.log('UNKNOWN: ' + tweet.id_str);
    }
    console.log('--------------------------------');
    io.emit('tweets', 
      tweet
    );
  }














};