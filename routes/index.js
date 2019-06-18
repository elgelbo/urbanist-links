const express = require('express');
const router = express.Router();
// IMPORT CONTROLLERS
const pageControl = require('../controllers/pageControl');

router.get('/', pageControl.home);

module.exports = router;