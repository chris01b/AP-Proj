// TAKEN FROM https://developers.google.com/maps/documentation/javascript/geolocation

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    console.log(pos.lat, pos.lng);

  }, function(err) {
      console.error(err);
  });
} else {
  console.log('Browser doesn\'t support Geolocation'); // Browser doesn't support Geolocation
}
