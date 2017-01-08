var LocalStrategy = require('passport-local').Strategy;
var User = require('../model/user');

module.exports = function (passport) {

    passport.use('login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            process.nextTick(function () {
                User.findOne({
                    'local.email': email
                }, function (err, user) {
                    if (err)
                        return done(err);

                    if (!user)
                        return done(null, false);

                    if (!user.validPassword(password))
                        return done(null, false);
                    else
                        return done(null, user);
                    a
                });
            });

        }
    ));
}
