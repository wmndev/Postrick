var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('../utils/bcryptUtil.js');

module.exports = function (passport) {

    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },
        function (req, username, password, done) {
        console.log('trying to logib');
            var db = req.db;
            var users = db.get('users');

            users.findOne({
                username: username
            }).then(function (doc) {
                if (!doc) {
                    console.log('User not found: ' + username);
                    return done(null, false);
                }

                if (!bCrypt.comparePasswords(doc.password, password)) {
                    console.log('Invalid password: ' + username);
                    return done(null, false);
                }

                return done(null, user);
            });
        }
    ));
}