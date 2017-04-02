var request = require('request');

const baseElevationURL = 'https://maps.googleapis.com/maps/api/elevation/json';
const baseRoadsURL = 'https://roads.googleapis.com/v1/speedLimits';

module.exports = {
    getElevation: function(lat, long, APIkey, callback) {
        var requestURL = baseElevationURL + '?locations=' + lat + ',' + long + '&key=' + APIkey;
        request(requestURL, function (err, response, body) {
            var pbody = JSON.parse(body);
            if (err) console.error('request error:', err);
        	else if (pbody.status !== 'OK') {
                callback(pbody.status + ':' + pbody.error_message, null);
            } else {
                callback(null, pbody.results[0].elevation);
            }
        });
    },

    getSpeedLimit: function(path, APIkey) {
        var requestURL = baseURL + '?path=' + lat + ',' + long + '&key=' + APIkey;
        request(requestURL, function (err, response, body) {
            var pbody = JSON.parse(body);
            if (err) console.error('request error:', err);
            else {
                callback('warning' + ':' + pbody.warningMessage, pbody.speedLimits[0].speedLimit);
            }   
        });
    }
};
