/**
 * TAKEN FROM https://developers.google.com/maps/documentation/javascript/geolocation
 */

/*eslint-env jquery */
/*globals io */
var socket = io.connect(location.origin);

function doLocation() {
    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        console.log(pos); // CURRENTLY NOT SENDING!!! PLS FIX!
        
        // send pos
        socket.emit('coords', pos);
        
        socket.on('elevation', function(elevation) {
            $(document).ready(function() {
                $('#elevationID').text(elevation.toFixed(0) + ' meters');
            });
        });
        
    }, function(err) {
          console.error(err);
    });
}

if (navigator.geolocation) {
    setInterval(doLocation, 2000);
} else {
  console.log('Browser doesn\'t support Geolocation'); // Browser doesn't support Geolocation
}