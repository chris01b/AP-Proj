#!/usr/bin/env node

/**
 * Module dependencies.
 */

// Import the http module
var http = require('http');
// Import debug module for logs
var debug = require('debug')('ap-proj:server');
// Import the app function from app.js
var app = require('../app');
// Import the getData module from getData.js
var getData = require('../getData')

/**
 * Get port from environment and store in Express.
 */

// set port to be the PORT enviroment variable or 8080 if
// PORT is not a valid number
var port = normalizePort(process.env.PORT || '8080');
// set the port variable to be used as the port in the app
app.set('port', port);

/**
 * Show debug info if in a development enviroment
 */
// If the enviroment variable NODE_ENV is development,
// set development to true, otherwise false
if (process.env.NODE_ENV === 'development') {
    var development = true;
    // Turn on debug info for ap-proj:server
    process.env.DEBUG = 'ap-proj:server';
} else {
    var development = false;
    // Otherwise, don't display debug info
    process.env.DEBUG = '';
}

/**
 * Create HTTP server.
 */

// Define server as the http server with the app from app.js
// as the listener for requests and responses
var server = http.createServer(app);

// Import socket.io for communicating with the client
var io = require('socket.io')(server);

/**
 * Listen on provided port, on all network interfaces.
 */

// Begin accepting connections on the specified port
server.listen(port);
// When there is an error, pass it to the onError function
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
    // If the syscall that failed was not listen, throw the error
    if (error.syscall !== 'listen') {
        throw error;
    }

    // Set bind to be 'Pipe' plus the port if it's a string or 'Port'
    // plus the port if it's not
    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        // If the program doesn't have enough privleges, display the
        // port and that it requires elevated privleges
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            // Exit with a failure code
            process.exit(1);
            break;
        // If the port is already in use, display the port and that
        // it's already in use
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            // Exit with a failure code
            process.exit(1);
            break;
        // If none of the other cases match, throw the error
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    // Set addr to be the server address
    var addr = server.address();
    // Set bind to be 'pipe' plus the addr if it's a string or 'port'
    // plus the port if it's not
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    // Output that the server listening on the variable bind
    debug('Listening on ' + bind);
}

/**
 * Test socket.io code
 */

// When the server connects to the client run the function and pass
// socket as the specific client
io.on('connection', function(socket) {
    // sets userIP to be the socket's remote address
    var userIP = socket.request.connection.remoteAddress;
    // Output that a user connected
    if (development === true) {
        console.log('A user connected from', userIP);
    }
    // When the user emits the coords event, pass a function with
    // the variable data as the data it receives
    socket.on('coords', function(data) {
        // Execute getData.js on the location received and pass a function
        // containg an error and the location's elevation variable
        getData.getElevation(data.lat, data.lng, function(err, elevation) {
            // Output the error if there is one
            if (err) console.error(err);
            // Output the elevation if in dev mode
            if (development === true) {
                console.log(elevation + ' from ' + userIP);
            }
            // Emit an elevation event with the location's elevation to the client
            socket.emit('elevation', elevation);
        });
    });
});