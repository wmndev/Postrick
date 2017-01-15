var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var expressSession = require('express-session');
var _ = require('underscore');
var dbConfig = require('./config/db.js');
var graph = require('fbgraph');

//=============
// Mongoose
//=============
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Mongo DB is connected..')
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//passport configuration
app.use(expressSession({
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

var initPassport = require('./passport/init');
initPassport(passport);

//==========
// Routes
//==========
var index = require('./routes/index')(passport);
var users = require('./routes/users');

var configAuth = require('./config/auth');
app.use(function (req, res, next) {
    if (!_.isUndefined(req.user) && _.isUndefined(req.session.facebook.graph)) {
        if (!_.isUndefined(req.user.facebook.token)) {
            var options = {
                timeout: 3000,
                pool: {
                    maxSockets: Infinity
                },
                headers: {
                    connection: "keep-alive"
                }
            };
            req.session.facebook.graph = graph.setAccessToken(req.user.facebook.token)
                .setAppSecret(configAuth.facebookAuth.clientSecret)
                .setVersion(configAuth.facebookAuth.apiVersion)
                .setOptions(options)
        }

        //         graph
        //            .get('me?fields=friends{name,link}', function (err, res) {
        //            console.log(err);
        //                console.log(res); 
        //            res.friends.data.forEach(function(e){
        //                console.log(e);
        //            })
        //            });

        //console.log(graphObject);
    }
    next();
});

app.use('/', index);
app.use('/users', users);


//================
// Static paths
//app.use('/', express.static(__dirname + '/www')); // redirect root
//================
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//===============
// Error handler
//===============
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;