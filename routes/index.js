var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/pre', function (req, res, next) {
    res.render('index');
});

router.get('/', function (req, res, next) {
    res.render('vue_index');
});

router.get('/login/sejong', function (req, res, next) {
    res.send(req.body);
});

module.exports = router;
