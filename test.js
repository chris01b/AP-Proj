var getOverpass = require('./overpassData')

var speedLimit = new getOverpass('[out:json];(way(around:10,40.014745, -75.324007)[highway][maxspeed];>;);out;');

speedLimit.getSpeedLimit((err, data) => {
	if (err) {
    	console.error(err);
	} else {
    	console.log(data);
	}
});
