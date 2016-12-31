var localStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

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

                if (!isValidPassword(doc, password)) {
                    console.log('Invalid password: ' + username);
                    return done(null, false);
                }

                return done(null, user);
            });
        }
    ));

    var isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);
    }
}
