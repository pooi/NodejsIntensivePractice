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

router.post('/filter', function(req, res){
    console.log(req.body);

    var data = req.body;

    var sql = "SELECT * FROM lost";
    var conditions = [];
    var params = [];
    if(data.isAllDayDate){
        if(data.date !== null){
            conditions.push(" discovery_date=?");
            params.push(data.date);
        }
    }else{
        if(data.startDate !== null){
            conditions.push(" ?<=discovery_date");
            params.push(data.startDate);
        }
        if(data.finishDate !== null){
            conditions.push(" discovery_date<=?");
            params.push(data.finishDate);
        }
    }

    if(conditions.length > 0){
        sql += " WHERE";
    }
    for(var i=0; i<conditions.length; i++){
        sql += conditions[i];
        if(i+1 < conditions.length){
            sql += " AND";
        }
    }
    // {
    //     category: this.category,
    //     subcategory: this.subcategory,
    //     date: this.date,
    //     startDate: this.startDate,
    //     finishDate: this.finishDate,
    //     isAllDayDate: this.dateCheckbox,
    //     rgtDate: this.rgtDate,
    //     rgtStartDate: this.rgtStartDate,
    //     rgtFinishDate: this.rgtFinishDate,
    //     isAllDayRgtDate: this.rgtDateCheckbox
    // }
    sql +=  " ORDER BY id DESC;";
    console.log(sql);
    // var sql = 'SELECT * FROM lost ORDER BY id DESC;';
    conn.query(sql, params, function (err, results, fields) {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
        var json = JSON.stringify(results);
        res.send(json);
    });
});

router.post('/search', function(req, res){
    console.log(req.body);

    var data = req.body;

    var sql = "SELECT * FROM lost";
    var conditions = [];
    var params = [];
    if(data.isAllDayDate){
        if(data.date !== null){
            conditions.push(" discovery_date=?");
            params.push(data.date);
        }
    }else{
        if(data.startDate !== null){
            conditions.push(" ?<=discovery_date");
            params.push(data.startDate);
        }
        if(data.finishDate !== null){
            conditions.push(" discovery_date<=?");
            params.push(data.finishDate);
        }
    }

    if(conditions.length > 0){
        sql += " WHERE";
    }
    for(var i=0; i<conditions.length; i++){
        sql += conditions[i];
        if(i+1 < conditions.length){
            sql += " AND";
        }
    }
    sql +=  " ORDER BY id DESC;";
    console.log(sql);
    // var sql = 'SELECT * FROM lost ORDER BY id DESC;';
    conn.query(sql, params, function (err, results, fields) {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
        var json = JSON.stringify(results);
        res.send(json);
    });
});


router.get('/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'SELECT * FROM lost WHERE id=?';
    conn.query(sql, [id], function (err, results, fields) {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
        var json = JSON.stringify(results[0]);
        console.log(json);
        res.render('manage_detail', {userData: JSON.stringify(req.session.userData), data: json});
    });
});

module.exports = router;
