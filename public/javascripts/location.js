"use strict"; // Run in strict mode

/*eslint-env jquery, browser*/
/*globals io */

// Import the socket as the address of the server
var socket = io.connect(location.origin);

/**
 * Display the elevation
 */

function getLocation() {
    // Pass the browser's location to a function called position
    navigator.geolocation.getCurrentPosition(position => {
        // Create an object called pos containing the latitiude and longitude
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        // Log the location object in the browser
        console.log(pos);
        
        // Emit the location to the server as a location event
        socket.emit("location", null, pos);
        
        // When a speedlimit event happenens, pass a function with an
        // optional error and the speedlimit
        socket.on("speedLimit", (err, speedLimit, speedLimitAverage) => {
            console.log(speedLimitAverage);
            // If there is an error, output it in the browser console
            function replaceText(toPlace, tag) {
                $(document).ready(() => {
                    $(tag).text(toPlace);
                });
            }

            if (err) {
                console.error(err);
                // If the error is "No speed limit data available"...
                if (err === "No speed limit data available") {
                    replaceText(err, "#speedLimitID");
                }
            } else {
                // If there is no error, output the speedLimit in the browser console
                console.log(speedLimit);
                replaceText(speedLimit, "#speedLimitID");
            }
            replaceText(speedLimitAverage, "#averageSpeedID");
        });
        
        // Pass the elevation when receiving the elevation event
        socket.on("elevation", (err, elevation) => {
            if (err) console.error(err);
            // When the document is ready, look set the text to items with the id
            // "elevationID" to have the elevation without its decimal points
            $(document).ready(() => {
                // Replace tags with the ID #elevationID's text with the elebvation
                // without decimals plus its unit
                $("#elevationID").text(elevation.toFixed(0) + " meters");
            });
        });
        
    }, err => {
        // Otherwise, emit the error to the location event
        socket.emit("location", err, null);
    });
}

// If the browser has geolocation capabilites, run the doLocation function every 2 seconds
if (navigator.geolocation) {
    // Run location repeatedly every 2 seconds
    setInterval(getLocation, 2000);
} else {
    // Otherwise, emit an error to the location event that it doesn"t support geolocation
    socket.emit("location", "Browser doesn't support Geolocation", null);
}
