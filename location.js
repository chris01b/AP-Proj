// TAKEN FROM https://developers.google.com/maps/documentation/javascript/geolocation

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    
  }, function(err) {
      console.error(err);
  });
} else {
  // Browser doesn't support Geolocation
}