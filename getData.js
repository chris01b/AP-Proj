// Import the node.js client libraries for google maps as googleMapsClient
var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDJUarszRbkOE-7jmdWmU9SKEKduoLFxYY' // The API key for the Google Maps API
});

module.exports = { // Anything in this object will be exported
    /**
     * Input coordinates to return a function containing an optional error and elevation
     */
    getElevation: function(lat, lng, callback) {
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
    },

    // Currently just returns the body of the response. TBA: return just the speed limit
    getSpeedLimit: function(lat, lng, callback) {
        googleMapsClient.snappedSpeedLimits({
            path: {
                latitude: lat,
                longitude: lng
            },
            units: 'MPH'
        }, function(err, response) {
            if (err) {
                callback(err, null);
            } else {
                callback(response.json);
            }
        });
    }
};