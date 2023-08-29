var express = require('express');
var router = express.Router();
// Require the cookie-parser middleware
var cookieParser = require('cookie-parser');



console.log("Router Loaded");

router.use(cookieParser())

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Placement App' });
});


router.use('/emp', require('./employees'));

router.use('/stdlist', require('./student'));

module.exports = router;
