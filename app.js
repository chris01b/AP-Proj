"use strict"; // Run in strict mode

/**
 * Imports
 */

// Import the express module
/*eslint-disable no-unused-params */
var express = require("express");
// Import the path module
var path = require("path");
// Import the morgan module as logger
var logger = require("morgan");
// Import the node sass middleware module
var sassMiddleware = require("node-sass-middleware");

// Import the index route for traffic to the main page
var index = require("./routes/index");

// Create a variable "app" that runs the express module
var app = express();

// If the command line argument "-d" is passed,
// set development to true, otherwise false
var development = process.argv[2] === "-d" ? true : false;

/**
 * View engine setup
 */

// Sets the directory for the applications views to be in the views directory
app.set("views", path.join(__dirname, "views"));    // Needs the path module in order
                                                    // to get the current directory name
// Sets the rendering engine to be pug
app.set("view engine", "pug");

// Outputs logs of the method used for the request, its url,
// status, response time, and length of the response if in development mode
if (development === true) {
    app.use(logger("dev"));
}
// Use sass stylesheets
app.use(sassMiddleware({
    // set the input of the scss files to the public folder
    src: path.join(__dirname, "public"),
    // set the input of the css files to the public folder
    dest: path.join(__dirname, "public"),
    // set the syntax to scss - not sass
    indentedSyntax: false,
    // create a source map file that allows browsers to link the scss and css files
    sourceMap: true
}));
// Set the static assets directory to be the public folder
app.use(express.static(path.join(__dirname, "public")));    // Needs the path module in order
                                                            // to get the current directory name

// use the imported index route for the root directory
app.use("/", index);

/**
 * Catch 404 and forward to error handler
 */

app.use((req, res, next) => {
    // Create an error object called "Not Found"
    var err = new Error("Not Found");
    // Make the status of the object 404
    err.status = 404;
    // Pass the error object the error handler
    next(err);
});

/**
 * Error handler
 */

app.use((err, req, res, next) => {
  // Set the local message to be the error message
  res.locals.message = err.message;
  // Set the local error to be the error object if it is in development, otherwise
  // set it to an empty object
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Set the error status to be the provided one or if there is none, 500
  res.status(err.status || 500);
  // Load the error.pug file in the views folder
  res.render("error");
});

// Export the app object
module.exports = app;
