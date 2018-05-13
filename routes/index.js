const express = require('express');
const router = express.Router();
const Tweet = require('../models/Tweet');



// GLOBAL
router.get('/',  (req, res) => {
  Tweet.getTweets(0,0, function(tweets) {
    res.render('home', {tweets: JSON.stringify(tweets)});
  });
});

router.get('/page/:page/:skip', (req, res) => {
  Tweet.getTweets(req.params.page, req.params.skip, function(tweets) {
    res.render('home', {tweets: JSON.stringify(tweets)});
  });
});

module.exports = router;
