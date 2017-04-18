"use strict"; // Run in strict mode

// Import osmtogeojson library to convert overpass API responses into a better format
var osmtogeojson = require("osmtogeojson");
// Import querystring for encoding things into URI components
var querystring = require("querystring");
// Import request for API calls
var request = require("request");

// Create a class 
class getOverpass {

	constructor (query) {
    	this.query = query;
	}

	/**
	* getRaw() was inspired by perliedman's query-overpass
	* https://github.com/perliedman/query-overpass
	*/

	// This function passes a callback
	getRaw (callback) {
		// set the request options for the API
    	var reqOptions = {
    		// Make the header show up as an appication
	        headers: {
	            "content-type": "application/x-www-form-urlencoded"
	        },
	        	// Make the body be the URI-encoded query
	        	body: querystring.stringify({ data: this.query })
    	};
    	// Execute the API call using the request options
    	// Pass a function with the request and its error
	    request.post("http://overpass-api.de/api/interpreter", reqOptions, (err, res, body) => {
	        var geojson;

	        // If there is no error, and there is a 200 OK response do the following
	        if (!err && res.statusCode === 200) {
	        	// Set geojson to be the converted OSM to JSON response from the api call
	            geojson = osmtogeojson(JSON.parse(body), {
	                flatProperties: false
	            });
	            // Return the json output as the callback with no error
	            callback(undefined, geojson);
	        } else if (err) {
	        	// Otherwise, if there was an error, just call the error back
	            callback(err);
	        } else if (res) {
	        	// if the statuscode was anything other than 200, pass the callback with
	        	// the statuscode
	            callback({
	                message: "Request failed: HTTP " + res.statusCode,
	                statusCode: res.statusCode
	            });
	          // Otherwise, pass to the callback with an error that somethign else went wrong
	        } else {
	            callback({
	                message: "Unknown error."
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
	            // Set the speedlimit to be the maxspeed field in the tags field in the
	            // properties field from first feature from the response
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

// Export the getOverpass class so that other files can use it
module.exports = getOverpass;
