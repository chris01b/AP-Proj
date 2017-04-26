"use strict"; // Run in strict mode

// Import osmtogeojson library to convert overpass API responses into a better format
var osmtogeojson = require("osmtogeojson");
// Import querystring for encoding things into URI components
var querystring = require("querystring");
// Import request for API calls
var request = require("request");
// Import getData functions
var getData = require("./getData");

// Create a class 
class getOverpass {

	// Initialize the query object created with initializing the class
	constructor (query) {
        // Set query to be the class's variable
    	this.query = query;
        // Initialize the average class variable
        this.average = 0;
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
	        	// If the statuscode was anything other than 200, pass the callback with the statuscode
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

	// This function passes a callback
	getSpeedLimit (callback) {
		// Use the getRaw function from the initialized class. Pass an err and data through a functon
		this.getRaw((err, data) => {
			// If there is an error, return only the error to the callback function
	        if (err) {
	        	// Throw just an error with the callback
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

    // Get the average of all the speed limits
    getAverageSpeedLimit(callback) {
        // set uncutSpeed to be the array of all recorded speed limits
        var uncutSpeed = getData.averageArr;
        // Initialize cutSpeed variable
        var cutSpeed = [];
        // For every string in the array... 
        for (var i in uncutSpeed) {
            // remove all non-numbers in the string
            var speed = uncutSpeed[i].replace(/\D/g,'');
            // convert the string to a number and add it to the end of cutSpeed
            cutSpeed.push(parseInt(speed));
        }
        var cutSpeedLength = 0;
        // Add up all the numbers in cutSpeed
        var speedLimitTotal = cutSpeed.reduce((acc, cur) => {
            // If the current speed limit was found, add it with the previous and return it
            if (cur !== 555) {
                cutSpeedLength++;
                return acc + cur;
            } else {
                return acc;
            }
        }, 0);
        // Set the average speed limit
        this.average = speedLimitTotal / cutSpeedLength;
        // And return it
        return this.average;
    }
}

// Export the getOverpass class so that other files can use it
module.exports = getOverpass;
