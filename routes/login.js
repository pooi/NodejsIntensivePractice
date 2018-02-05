var express = require('express');
var exec = require('child_process').exec;
var router = express.Router();

// var phantom = require('phantom');
// var casper = require('casper').create({
//     pageSettings:{
//         userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36'
//     }
// });
var casper = require('casper').create();
var cheerio = require('cheerio');
var request = require('request');

router.get('/pre', function (req, res, next) {
    res.render('index');
});

router.get('/', function (req, res, next) {
    res.render('vue_index');
});

router.post('/sejong', function (req, res, next) {

    const id = req.body.id;
    const pw = req.body.password;

    var COMMAND = 'python3 "{0}/loginSejong.py" {1} {2}';
    var command = COMMAND.format(__dirname, id, pw);
    console.log(command);

    exec(command, function(err, stdout, stderr) {

        // console.log(err, stdout, stderr);

        if(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }else{

            var result = stdout;

            var data = JSON.parse(result);
            console.log(data);

            res.send(data);

        }

    });

});

module.exports = router;
