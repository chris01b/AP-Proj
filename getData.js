var request = require('request');

const baseURL = 'https://maps.googleapis.com/maps/api/elevation/json';

var exports = module.exports = {};

exports.getElevation = function(lat, long, APIkey) {
    var requestURL = baseURL + '?locations=' + lat + ',' + long + '&key=' + APIkey;
    
    request(requestURL, function (error, response, body) {
        var parsedBody = JSON.parse(body);
        
    	if (error) {
    	    console.error(' request error:', error);
    	}
    	if (parsedBody.status !== 'OK') {
    	    console.log('error:', parsedBody.status + ':', parsedBody.error_message);
    	}
    	else {
    	    console.log(body);
    	}
    });
};
