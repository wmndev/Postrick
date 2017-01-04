var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('../utils/bcryptUtil.js');

module.exports = function (passport) {

    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },
        function (req, username, password, done) {
            var db = req.db;

            var users = db.get('users');
            users.findOne({
                username: username
            }).then(function (doc) {
                if (!doc) {
                    console.log('User not found: ' + username);
                    return done(null, false);
                }
                var isMatched = bCrypt.comparePasswords(password, doc.password);
                console.log('isMatched :' + isMatched);
                console.log('!isMatched :' + !isMatched);

                if (!isMatched) {
                    console.log('Invalid password: ' + username);
                    return done(null, false);
                }
                console.log('sucessfully authenticated user:' + username);

                return done(null, doc);
            });
        }
    ));
}
