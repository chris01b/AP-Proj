/**
 * Imports
 */

// Import the express module
/*eslint-disable no-unused-params */
var express = require('express');
// Import the path module
var path = require('path');
// Import the morgan module as logger
var logger = require('morgan');
// Import the node sass middleware module
var sassMiddleware = require('node-sass-middleware');

// Import the index route for traffic to the main page
var index = require('./routes/index');

// Create a variable 'app' that runs the express module
var app = express();

/**
 * View engine setup
 */

// Sets the directory for the applications views to be in the views directory
app.set('views', path.join(__dirname, 'views'));    // Needs the path module in order
                                                    // to get the current directory name
// Sets the rendering engine to be pug
app.set('view engine', 'pug');

// Outputs logs of the method used for the request, its url,
// status, response time, and length of the response
app.use(logger('dev'));
// Use sass stylesheets
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'), // set the input of the scss files to the public folder
  dest: path.join(__dirname, 'public'), // set the input of the css files to the public folder
  indentedSyntax: false, // set the syntax to scss - not sass
  sourceMap: true // create a source map file that allows browsers to link the scss and css files
}));
// Set the static assets directory to be the public folder
app.use(express.static(path.join(__dirname, 'public')));    // Needs the path module in order
                                                            // to get the current directory name

// use the imported index route for the root directory
app.use('/', index);

/**
 * Catch 404 and forward to error handler
 */

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * Error handler
 */

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
