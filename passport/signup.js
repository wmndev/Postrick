var LocalStrategy = require('passport-local').Strategy;
var User = require('../model/user');

module.exports = function (passport) {

    passport.use('signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            findOrCreateUser = function () {

                User.findOne({'local.email' : email}, function(err, existingUser){
                    if (err)
                        return done(err);

                    if (existingUser){
                        console.log('User -' + email + '- already exists');
                        return done(null, false);
                    }

                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save(function(err){
                        if (err){
                            throw err;
                        }

                        console.log('Welcome ' + email + '!');
                        return done(null, newUser);
                    });
                });
            };
            process.nextTick(findOrCreateUser);
        }));
}
