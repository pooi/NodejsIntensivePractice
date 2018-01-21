var express = require('express');
var multer = require('multer');
var _storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
        // console.log(file);
    }
});
var upload = multer({
    storage: _storage
});
var conn = require('../config/db')();
var router = express.Router();

var vision = require('google-vision-api-client');
var requtil = vision.requtil;

//Prepare your service account from trust preview certificated project
var jsonfile = __dirname + '/../config/NodePractice-2f88e00ddb65.json';

//Initialize the api
vision.init(jsonfile);


/* GET lost listing. */
router.get('/', function (req, res) {
    res.render('lost');
});
router.post('/', upload.single('image-file'), function (req, res) {
    console.log(req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
    //Build the request payloads

    var d = requtil.createRequests().addRequest(
        requtil.createRequest(__dirname + '/../uploads/' + req.file.filename)
            .withFeature('LABEL_DETECTION', 3)
            .withFeature('TEXT_DETECTION', 4)
            .build());


    //Do query to the api server
    vision.query(d, function (e, r, d) {

        if (e) console.log('ERROR:', e);
        console.log(JSON.stringify(d));

        var json = JSON.stringify(d);
        var obj = JSON.parse(json);
        var obj_response = obj.responses[0];
        var labelAnnotations = obj_response.labelAnnotations;
        var textAnnotations = obj_response.textAnnotations;

        var labels = [];
        var texts = [];

        for(var i=0; i<labelAnnotations.length; i++){
            labels[i] = labelAnnotations[i].description;
        }

        var index = 0;
        for(var i=1; i<textAnnotations.length; i++){
            var t = textAnnotations[i].description;
            if(t === "." || t === "!" || t === "," || t === "?" || t === " " || t === "/" || t === ":" || t === "-" || t === "·" || t === '"' || t === "'")
                continue
            texts[index] = textAnnotations[i].description;
            index ++;
        }

        res.render('lost', {image: req.file.filename, labels: labels, texts: texts});

    });

});

module.exports = router;

