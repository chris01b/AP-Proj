var request = require('request');

const baseURL = 'https://maps.googleapis.com/maps/api/elevation/json';

module.exports.getElevation = function(lat, long, APIkey, callback) {
    var requestURL = baseURL + '?locations=' + lat + ',' + long + '&key=' + APIkey;
    
    request(requestURL, function (err, response, body) {
        var pbody = JSON.parse(body);
        
    	if (err) console.error('request error:', err);
    	
    	else if (pbody.status !== 'OK') {
    	    callback(pbody.status + ':' + pbody.error_message, null);
    	}
    	else {
    	    callback(null, pbody.results[0].elevation);
    	}
    });
};
