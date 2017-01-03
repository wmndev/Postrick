var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');

}

module.exports = function (passport) {

    /* GET home page. */
    router.get('/', function (req, res, next) {
        res.render('index', {
            title: 'Express'
        });
    });

    /*GET userlist page*/
    router.get('/userlist', isAuthenticated, function (req, res) {
        var db = req.db;
        var users = db.get('users');
        users.find({}, {}, function (e, docs) {
            res.render('userlist', {
                'userlist': docs
            });
        });
    });

    /*GET New User page*/
    router.get('/newuser', function (req, res) {
        res.render('newuser', {
            title: "Add New User"
        })
    });

    router.post('/login', passport.authenticate('login', {
        successRedirect: '/userlist',
        failureRedirect: '/',
        failureFlash: true
    }));

    router.get('/signup', function(req, res){
        res.render('register', {title: "Sign Up"})
    })

    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/userlist',
        failureRedirect: '/signup'
    }));

    /*POST add user*/
    router.post('/adduser', function (req, res) {
        var db = req.db;

        var userName = req.body.username;
        var password = req.body.password;

        var users = db.get('users');

        users.insert({
                "username": userName,
                "password": password
            },
            function (err, doc) {
                if (err) {
                    res.send('There was an error');
                } else {
                    res.redirect('userlist');
                }
            });
    });

    return router;
}
