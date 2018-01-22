var express = require('express');
var conn = require('../config/db')();
var router = express.Router();

function convertResult(results) {
    for (var i = 0; i < results.length; i++) {
        var result = results[i];
        var subImage = new String(result.subImage);
        var images = subImage.split(",");
        result.mainImage = images[1];
        // console.log(images);
    }
    return results
}

/* GET users listing. */
// router.get('/', function (req, res, next) {
//     res.send('respond with a resource');
// });

router.get('/', function (req, res) {
    // res.render('temp');
    var page = 0;
    var sql = 'SELECT * FROM attractionsTbl limit ?, 30';
    conn.query(sql, [page], function (err, results, fields) {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
        res.render('find', {items: convertResult(results), page: page});
    });
});
router.get('/:page', function (req, res) {
    var page = req.params.page;
    if (page) {
        page = parseInt(page);
    } else {
        page = 0;
    }
    var page2 = page * 30;
    var sql = 'SELECT * FROM attractionsTbl limit ?, 30';
    conn.query(sql, [page2], function (err, results, fields) {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
        res.render('find', {items: convertResult(results), page: page});
    });
});

module.exports = router;