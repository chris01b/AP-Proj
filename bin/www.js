"use strict"; // Run in strict mode

/**
 * Module dependencies.
 */

// Import the http module
var http = require("http");
// Import debug module for logs
var debug = require("debug")("ap-proj:server");
// Import the app function from app.js
var app = require("../app");
// Import the getData module from getData.js
var getData = require("../getData")

/**
 * Get port from environment and store in Express.
 */

// set port to be the PORT enviroment variable or 8080 if
// PORT is not a valid number
var port = normalizePort(process.env.PORT || "8080");
// set the port variable to be used as the port in the app
app.set("port", port);

/**
 * Show debug info if in a development enviroment
 */

// If the command line argument "-d" is passed,
// set development to true, otherwise false
var development;
// Check to see if the second commad argument was "-d"
if (process.argv[2] === "-d") {
    development = true;
    // Turn on debug info for ap-proj:server
    process.env.DEBUG = "ap-proj:server";
} else {
    development = false;
    // Otherwise, don't display debug info
    process.env.DEBUG = "";
}

/**
 * Create HTTP server.
 */

// Define server as the http server with the app from app.js
// as the listener for requests and responses
var server = http.createServer(app);

// Import socket.io for communicating with the client
var io = require("socket.io")(server);

/**
 * Listen on provided port, on all network interfaces.
 */

// Begin accepting connections on the specified port
server.listen(port);
// When there is an error, pass it to the onError function
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    // Make sure that the port is a base 10 integer
    var port = parseInt(val, 10);
    
    // If the port is not a number, it is a pipe, so return its value
    if (isNaN(port)) {
        // named pipe
        return val;
    }

    // If the port number is greater than or equal to 0, return its value
    if (port >= 0) {
        // port number
        return port;
    }
    
    // Otherwise, return false
    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    // If the syscall that failed was not listen, throw the error
    if (error.syscall !== "listen") {
        throw error;
    }

    // Set bind to be "Pipe" plus the port if it's a string or "Port"
    // plus the port if it's not
    var bind = typeof port === "string"
        ? "Pipe " + port
        : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        // If the program doesn"t have enough privleges, display the
        // port and that it requires elevated privleges
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            // Exit with a failure code
            process.exit(1);
            break;
        // If the port is already in use, display the port and that
        // it's already in use
        case "EADDRINUSE":
            console.error(bind + " is already in use");
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
    // Set bind to be "pipe" plus the addr if it's a string or "port"
    // plus the port if it's not
    var bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr.port;
    // Output that the server listening on the variable bind
    debug("Listening on " + bind);
}

/**
 * Socket.io code
 */

// When the server connects to the client run the function and pass
// socket as the specific client
io.on("connection", socket => {
    // sets userIP to be the socket's remote address
    var userIP = socket.request.connection.remoteAddress;
    // Output that a user connected
    if (development === true) {
        console.log("A user connected from", userIP);
    }
    
    // When the user emits the location event, pass a function with
    // the variable data as the data it receives
    socket.on("location", (err, pos) => {
        // Output the error if there is one
        if (err) {
            console.error(userIP + " : " + err);
            socket.emit("speedLimit", err, null);
        }
        
        // Execute getData.js on the location received and pass a function
        // containg an error and the location's speed limit variable
        getData.getSpeedLimit(pos.lat, pos.lng, (err, speedLimit, speedLimitAverage) => {
            // Output the error if there is one and pass it to the callback
            if (err) {
                console.error(userIP + " : " + err);
                socket.emit("speedLimit", err, null);
            } else {
                socket.emit("speedLimit", null, speedLimit);
            }
            
            // Output the speed limit if in dev mode
            if (development === true && speedLimit != undefined) {
                console.log(userIP + " : " + speedLimit);
                console.log(speedLimitAverage);
            }
        });
        
        // Execute getData.js on the location received and pass a function
        // containg an error and the location's elevation variable
        getData.getElevation(pos.lat, pos.lng, (err, elevation) => {
            // Output the error if there is one and pass it to the callback
            if (err) {
                console.error(userIP + " : " + err);
                socket.emit("elevation", err, null);
            } else {
                // Emit an elevation event with the location's elevation to
                // the client if there was no error
                socket.emit("elevation", null, elevation);
            }
            
            // Output the elevation if in dev mode
            if (development === true && elevation !== null) {
                console.log(userIP + " : " + elevation);
            }
        });
        
    });
});
