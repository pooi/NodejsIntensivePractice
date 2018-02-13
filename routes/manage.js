var express = require('express');
var conn = require('../config/db')();
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('manage', {userData: JSON.stringify(req.session.userData)});

});

router.post('/lost', function(req, res){
    console.log(req.body);
    // var page = req.body.page;
    // if (page) {
    //     page = parseInt(page);
    // } else {
    //     page = 1;
    // }
    // if(page <= 0){
    //     page = 1;
    // }
    // var page2 = (page-1) * 30;
    var sql = 'SELECT * FROM lost ORDER BY id DESC;';
    conn.query(sql, [], function (err, results, fields) {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
        var json = JSON.stringify(results);
        res.send(json);
    });
});

module.exports = router;
