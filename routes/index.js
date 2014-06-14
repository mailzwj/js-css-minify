var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'JS/CSS 压缩工具' });
});

module.exports = router;
