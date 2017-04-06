/*eslint-env node */
var queryOverpass = require('query-overpass');

// Import the node.js client libraries for google maps as googleMapsClient
var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDJUarszRbkOE-7jmdWmU9SKEKduoLFxYY' // The API key for the Google Maps API
});

// Export the getSpeedLimit function
exports.getSpeedLimit = function(lat, lng, callback) {
    var query = "[out:json];(way(around:50," + lat + ", " + lng + ")[highway~'^(primary|secondary|tertiary|residential)$'][name][maxspeed];>;);out;";
    var options = {};
    queryOverpass(query, function(err, data) {
        if (err) {
            callback(err, null);
        }
        try {
            if (data.features.length === 0) {
                throw 'No speed limit data available';
            }
            var speedLimit = data.features[0].properties.tags.maxspeed;
            callback(null, speedLimit);
        } catch(err) {
            callback(err, null);
        }
    }, options);
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
        else if (response.json.status !== 'OK') {
            callback(response.json.status + ':' + response.json.error_message, null);
        } else {
            // otherwise, return the elevation
            callback(null, response.json.results[0].elevation);
        }
    });
};