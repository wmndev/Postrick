var login = require('./login');
var signup = require('./signup');
var facebook = require('./facebook');
var User = require('../model/user');



module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        console.log('serializing user: ' /*+ user.local.email*/);
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function(err, user){
            console.log('deserializing user :' /*+ user.local.email*/);
            done(err, user);
        });
    });

    login(passport);
    signup(passport);
    facebook(passport);
}
