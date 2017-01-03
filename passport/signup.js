var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('../utils/bcryptUtil.js');


module.exports = function (passport) {

    passport.use('signup', new LocalStrategy({
            passReqToCallback: true
        },
        function (req, username, password, done) {
            findOrCreateUser = function () {

                var db = req.db;
                console.log('in signup db->' + db);
                var users = db.get('users');
                users.findOne({
                    username: username
                }).then(function (doc) {
                    if (doc) {
                        console.log('user already exists:' + username);
                        return done(null, false);
                    } else {
                        console.log('about to create user');
                        users.insert({
                            username: username,
                            password: bCrypt.createHash(password)
                        }).then(function (user) {
                            console.log('welcome ' + user.username);
                            return done(null, user)
                        });
                    }

                });
            };
            process.nextTick(findOrCreateUser);
        }));
}
