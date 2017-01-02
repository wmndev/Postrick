var login = require('./login');
var dbConfig = require('../config/db.js');
var monk = require('monk');
var db = monk(dbConfig.url);

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        console.log('serializing user: ' + user);
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        var users = db.get('users');
        users.find({
            _id: id
        }, {}).then(function (doc) {
            console.log('deserializing user :' + doc);
            done(null, user);
        });
    });

    login(passport);
}
