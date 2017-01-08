var FacebookStrategy = require('passport-facebook').Strategy;
var dbConfig = require('../config/db.js');
var configAuth = require('../config/auth.js');

module.exports = function (passport) {

    passport.use(new FacebookStrategy({
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            passReqToCallback: true
        },

        function (req, token, refreshToken, profile, done) {
            process.nextTick(function () {

                //user already logged in
                var user = req.user;
                user.facebook.id = profile.id;
                user.facebook.token = token;
                user.facebook.name = profile.displayName;

                user.save(function (err) {
                    if (err) throw err;
                    return done(null, user);
                });

            });
        }
    ));
}
