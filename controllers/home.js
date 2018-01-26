var express = require('express');
var router = express.Router();

router.get('/',function(req,res) {
  res.send('<h1>Hello World</h2>');
});

module.exports = router;