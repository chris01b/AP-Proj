var request = require('request');

const baseURL = 'https://maps.googleapis.com/maps/api/elevation/json';

var exports = module.exports = {};

exports.getElevation = function(lat, long, APIkey) {
    var requestURL = baseURL + '?locations=' + lat + ',' + long + '&key=' + APIkey;
    
    console.log(requestURL);
    
    request(requestURL, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    });
};
