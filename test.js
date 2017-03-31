var getData = require('./getData');

const APIkey = 'AIzaSyDJUarszRbkOE-7jmdWmU9SKEKduoLFxYY';

getData.getElevation(39.7391536, -104.9847034, APIkey, function(err, elevation) {
    if (err) console.error(err);
    console.log(elevation);
});