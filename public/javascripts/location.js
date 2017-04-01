/**
 * TAKEN FROM https://developers.google.com/maps/documentation/javascript/geolocation
 */

var socket = io.connect(location.origin);
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    
    // We want to send pos
    socket.on('sendpls', function() {
      socket.emit('coords', pos);
    });
    socket.on('elevation', function(elevation) {
        $(document).ready(function() {
          $('#elevationID').text(elevation);
        });
    });
    
  }, function(err) {
      console.error(err);
  });
} else {
  console.log('Browser doesn\'t support Geolocation'); // Browser doesn't support Geolocation
}