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

/* GET lost listing. */
router.get('/', function (req, res) {
    res.render('lost');
});
router.post('/', upload.single('image-file'), function (req, res) {
    console.log(req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
    res.render('lost', {image: req.file.filename});
});

module.exports = router;

