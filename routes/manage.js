var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('manage', {userData: JSON.stringify(req.session.userData)});

});

module.exports = router;
