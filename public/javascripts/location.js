/*eslint-env jquery */
/*globals io */

// Import the socket as the address of the server
var socket = io.connect(location.origin);

/**
 * Display the elevation
 */

function doLocation() {
    // Pass the browser's location to a function called position
    navigator.geolocation.getCurrentPosition(function(position) {
        // Create an object called pos containing the latitiude and longitude
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        // Log the location object in the browser
        console.log(pos);
        
        // Emit the location to the server as a coords event
        socket.emit('coords', pos);
        
        // Pass the elevation when receiving the elevation event
        socket.on('elevation', function(elevation) {
            // When the document is ready, look set the text to items with the id
            // 'elevationID' to have the elevation without its decimal points
            $(document).ready(function() {
                $('#elevationID').text(elevation.toFixed(0) + ' meters');
            });
        });
        
    }, function(err) {
        // If there is an error, log it in browser
        console.error(err);
    });
}

// If the browser has geolocation capabilites, run the doLocation function every 2 seconds
if (navigator.geolocation) {
    setInterval(doLocation, 2000);
} else {
    // Otherwise, log in the browser that it doesn't support geolocation
    console.log('Browser doesn\'t support Geolocation');
}