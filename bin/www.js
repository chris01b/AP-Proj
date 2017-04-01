#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('ap-proj:server');
var http = require('http');
var getData = require('../getData')

/**
 * Google Maps API Key
 */

const APIkey = 'AIzaSyDJUarszRbkOE-7jmdWmU9SKEKduoLFxYY';

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '8080');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Require Socket.io
 */

var io = require('socket.io')(server);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
switch (error.code) {
    case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
    case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
    default:
        throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

/**
 * Test socket.io code
 */

io.on('connection', function (socket) {
    console.log('A user connected');
    socket.on('coords', function (data) {
        // At this point, we will execute getData.js on the location and then return it
        getData.getElevation(data.lat, data.lng, APIkey, function(err, elevation) {
            if (err) console.error(err);
            console.log(elevation);
            socket.emit('elevation', elevation);
        });
    });
});