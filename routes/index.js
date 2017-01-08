var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');

}

module.exports = function (passport) {

    //============
    // Index
    //============
    router.get('/', function (req, res, next) {
        res.render('index', {
            title: 'Express'
        });
    });


    //============
    // Login
    //============
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
        failureFlash: true
    }));

    //============
    // Register
    //============
    router.get('/signup', function (req, res) {
        res.render('register', {
            title: "Sign Up"
        })
    })

    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/signup'
    }));

    //==========
    // Dashboad
    //==========

    router.get('/dashboard', isAuthenticated, function (req, res) {
        res.render('dashboard', {
            title: "Profile"
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


    //================
    // FACEBOOK ======
    //================

    //facebook auth and login
    router.get('/connect/facebook', passport.authorize('facebook', {
        scope: 'email'
    }))

    //handle the callback
    router.get('/connect/facebook/callback', passport.authorize('facebook', {
        successRedirect: '/dashboard',
        failureRedirect: '/'
    }));

    //handle authenticate callback
    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/dashboard',
        failureRedirect: '/'
    }));



    //unlink
    router.get('/unlink/facebook', function (req, res) {
       var user = req.user;
        user.facebook.token = undefined;
        user.save(function(err){
           res.redirect('/dashboard');
        });
    });


    //========
    // Logout
    //========
    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    })

    return router;
}
