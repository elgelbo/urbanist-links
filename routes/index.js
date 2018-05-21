const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Tweet = require('../models/Tweet');
mongoose.Promise = global.Promise; //USE ES6 PROMISES see:http://mongoosejs.com/docs/promises.html#plugging-in-your-own-promises-library



// GLOBAL
router.get('/',  (req, res) => {
  Tweet.getTweets(0,0, function(tweets) {
    res.render('home', {tweets: JSON.stringify(tweets)});
  });
});

router.get('/tweets',  async (req, res) => {
  try {
    const top = await Tweet.find({}).limit(10).sort({
      score: -1
    });
    // Tweet.getTweets(0,0, function(tweets) {
    res.render('home', {tweets: top});
    // });
  } catch (e) {
    console.log(e);
  }
});

router.get('/page/:page/:skip', (req, res) => {
  Tweet.getTweets(req.params.page, req.params.skip, function(tweets) {
    res.render('home', {tweets: JSON.stringify(tweets)});
  });
});

module.exports = router;
