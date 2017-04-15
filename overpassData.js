"use strict";

var osmtogeojson = require("osmtogeojson");
var querystring = require("querystring");
var request = require("request");

class getOverpass {

	constructor (query) {
    	this.query = query;
	}

	getRaw (callback) {
    	var reqOptions = {
	        headers: {
	            'content-type': 'application/x-www-form-urlencoded'
	        },
	        	body: querystring.stringify({ data: this.query })
    	};
	    request.post('http://overpass-api.de/api/interpreter', reqOptions, (err, res, body) => {
	        var geojson;

	        if (!err && res.statusCode === 200) {
	            geojson = osmtogeojson(JSON.parse(body), {
	                flatProperties: false
	            });
	            callback(undefined, geojson);
	        } else if (err) {
	            callback(err);
	        } else if (res) {
	            callback({
	                message: 'Request failed: HTTP ' + res.statusCode,
	                statusCode: res.statusCode
	            });
	        } else {
	            callback({
	                message: 'Unknown error.'
	            });
	        }
	    });
	}

	getSpeedLimit (callback) {
		this.getRaw((err, data) => {
			// If there is an error, return only the error to the callback function
	        if (err) {
	            callback(err, null);
	        }
	        // Try the following. If there is an error, pass it to the catch function as err
	        try {
	            // If there is nothing in the features field in the response,
	            // throw a custom error that there is no speed limit data available
	            if (data.features.length === 0) {
	                throw "No speed limit data available";
	            }
	            // Set the speedlimit to be the maxspeed field in the tags field in the properties
	            // field from first feature from the response
	            var speedLimit = data.features[0].properties.tags.maxspeed;
	            // Return just the speedlimit as the callback
	            callback(null, speedLimit);
	        } catch(err) {
	            // Return just the error as the callback if one was thrown
	            callback(err, null);
	        }
		});
	}
}

module.exports = getOverpass;
