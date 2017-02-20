var express = require('express');
var _ = require('underscore');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

require('dotenv').config();
require('rootpath')();

var trigger = require('sync/sync.js');
var routes = require('config/router'); // This is routes instance for all routing

var app = express();


/**
 * Database connect
 */
const mongoMaxRetries = 100;
const defaultRetryMiliSeconds = 5000;
var mongoRetries = mongoMaxRetries;
var mongooseOptions = {
    db: {
        readPreference: "ReadPreference.SECONDARY",
        retryMiliSeconds: defaultRetryMiliSeconds
    },
    server: {
        auto_reconnect: true,
        socketOptions: {
            keepAlive: 30000,
            connectTimeoutMS: 30000,
        }
    },
    replset: {
        socketOptions: {
            keepAlive: 30000,
            connectTimeoutMS: 30000
        }
    }
}

function mongoDbConnect() {
    console.log('connecting with ' + process.env.MONGODB_URI);
    mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
}
mongoDbConnect();

mongoose.connection.on('error', function(err) {
    console.log('MongoDB connection error:' + err);
});
mongoose.connection.on('connecting', function() {
    console.log('Reconnecting to DB');
});
mongoose.connection.on('connected', function() {
    console.log("----->Database connected successfully...");
    // Reset
    mongoRetries = mongoMaxRetries;
    mongooseOptions.db.retryMiliseconds = defaultRetryMiliSeconds;
});
mongoose.connection.on('reconnected', function() {
    console.log("----->Datbase successfully reconnected");
});
mongoose.connection.on('disconnected', function() {
    console.log("----->Database disconnected... retries left: " + mongoRetries + " retry delay: " + mongooseOptions.db.retryMiliSeconds);
    if (mongoRetries > 0) {
        // Increase back off
        mongooseOptions.db.retryMiliSeconds += 100 * (mongoMaxRetries - mongoRetries);
        mongoDbConnect();
        mongoRetries--;
    } else {
        console.log("No mongodb connection retries left. Quitting.");
        process.exit(1);
    }
});

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});


/**
 * enable CORS for every request...
 */

var corsOptions = {
    allowedHeaders: ['Content-Type', 'Authorization', 'accept', 'x-auth-token', 'x-user-type']
}
app.use(cors(corsOptions));
app.options('/', cors(corsOptions));


/**
 * call sync script
 */

trigger.triggerSyncData();
trigger.startSync("", false);


// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});

// call route setup function....
routes.setup(app);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;