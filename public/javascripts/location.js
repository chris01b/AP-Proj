/*eslint-env jquery */

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
        
        // Emit the location to the server as a location event
        socket.emit('location', null, pos);
        
        socket.on('speedLimit', function(err, speedLimit) {
            if (err) {
                console.error(err);
                if (err === 'No speed limit data available') {
                    $(document).ready(function() {
                        $('#speedLimitID').text(err);
                    });
                }
            } else {
                console.log(speedLimit);
                $(document).ready(function() {
                    $('#speedLimitID').text(speedLimit);
                });
            }

        });
        
        // Pass the elevation when receiving the elevation event
        socket.on('elevation', function(err, elevation) {
            if (err) console.error(err);
            // When the document is ready, look set the text to items with the id
            // 'elevationID' to have the elevation without its decimal points
            $(document).ready(function() {
                $('#elevationID').text(elevation.toFixed(0) + ' meters');
            });
        });
        
    }, function(err) {
        // Otherwise, emit the error to the location event
        socket.emit('location', err, null);
    });
}

// If the browser has geolocation capabilites, run the doLocation function every 2 seconds
if (navigator.geolocation) {
    setInterval(doLocation, 2000);
} else {
    // Otherwise, emit an error to the location event that it doesn't support geolocation
    socket.emit('location', 'Browser doesn\'t support Geolocation', null);
}