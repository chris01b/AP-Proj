"use strict"; // Run in strict mode

var getOverpass = require('./overpassData');

// Import the node.js client libraries for google maps as googleMapsClient
var googleMapsClient = require("@google/maps").createClient({
    key: "AIzaSyDJUarszRbkOE-7jmdWmU9SKEKduoLFxYY" // The API key for the Google Maps API
});

var averageArr = [];

// Export the getSpeedLimit function
exports.getSpeedLimit = (lat, lng, callback) => {
    // Create an Overpass QL query to get road data for roads 10 meters around the coordinates that has a speedlimit set
    var speedLimit = new getOverpass("[out:json];(way(around:" + lat + ", " + lng + ")[highway][maxspeed];>;);out;");
    speedLimit.getSpeedLimit((err, data) => {
        if (data == undefined) {
            averageArr.push("-1");
        } else {
            averageArr.push(data);
        }
        callback(err, data, speedLimit.getAverageSpeedLimit());
    });
};

exports.averageArr = averageArr;

// Export the getElevation function
exports.getElevation = (lat, lng, callback) => {
    // Use the Google Maps client library to return to return the elevation
    // from the longitude and latitude defined in the function
    googleMapsClient.elevation({
        locations: {
            latitude: lat,
            longitude: lng
        }
    }, (err, response) => { // Return a function containing an error if there
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
