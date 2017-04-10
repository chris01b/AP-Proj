// Import the Overpass API wrapper to get Openstreetmap data
var queryOverpass = require("query-overpass");

// Import the node.js client libraries for google maps as googleMapsClient
var googleMapsClient = require("@google/maps").createClient({
    key: "AIzaSyDJUarszRbkOE-7jmdWmU9SKEKduoLFxYY" // The API key for the Google Maps API
});

// Export the getSpeedLimit function
exports.getSpeedLimit = function(lat, lng, callback) {
    // create an Overpass QL query to get road data for roads 10 meters around the coordinates that has a speedlimit set
    var query = "[out:json];(way(around:10," + lat + ", " + lng +
        ")[highway~'^(primary|secondary|tertiary|residential)$'][name][maxspeed];>;);out;";
    // Call the Overpass handler with the query. Pass a function with an optional error and response
    queryOverpass(query, function(err, data) {
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
};

// Export the getElevation function
exports.getElevation = function(lat, lng, callback) {
    // Use the Google Maps client library to return to return the elevation
    // from the longitude and latitude defined in the function
    googleMapsClient.elevation({
        locations: {
            latitude: lat,
            longitude: lng
        }
    }, function(err, response) {    // return a function containing an error if there
                                    // was one and the elevation
        // only return an error if there was one
        if (err) {
            callback(err, null);
        }
        // If there was no error, but it isn't responsing with an elevation,
        // return the status and its message
        else if (response.json.status !== "OK") {
            callback(response.json.status + ":" + response.json.error_message, null);
        } else {
            // otherwise, return the elevation
            callback(null, response.json.results[0].elevation);
        }
    });
};
