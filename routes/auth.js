
module.exports = function (app) {

    var express = require('express');
    var exec = require('child_process').exec;
    var session = require('express-session');
    var MySQLStore = require('express-mysql-session')(session);
    var router = express.Router();

    app.use(session({
        secret: '123IH2@OH%K2k32j4@#LBK2b5k24n',
        resave: false,
        saveUninitialized: true,
        store: new MySQLStore({
            host: 'localhost',
            port: 3306,
            user: 'user',
            password: '123456',
            database: 'o2'
        })
    }));

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
                req.session.userData = data;
                console.log('session: ', req.session);
                req.session.save(function() {
                    res.send(req.session.userData);
                });

                // res.send(data);

            }

        });

    });

    router.get('/logout', function (req, res, next) {

        delete req.session.userData;
        req.session.save(function() {
            var data = {
                status: "success"
            };
            res.send(JSON.stringify(data));
        });

    });

    // module.exports = router;
    return router;

};


