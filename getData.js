var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDJUarszRbkOE-7jmdWmU9SKEKduoLFxYY'
});

module.exports = {
    getElevation: function(lat, lng, callback) {
        googleMapsClient.elevation({
            locations: {
                latitude: lat,
                longitude: lng
            }
        }, function(err, response) {
            if (err) {
                callback(err, null)
            } else if (response.json.status !== 'OK') {
                callback(response.json.status + ':' + response.json.error_message, null);
            } else {
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