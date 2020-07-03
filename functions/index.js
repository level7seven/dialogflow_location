'use strict';
 
const functions = require('firebase-functions');
const NodeGeocoder = require("node-geocoder");

const {
dialogflow,
Permission
} = require('actions-on-google');
 
const app = dialogflow();
 
app.intent('location', (conv) => {
 
conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';
return conv.ask(new Permission({
context: 'to locate you',
permissions: conv.data.requestedPermission,
}));
 
});

app.intent('user_info', (conv, params, permissionGranted) => {
if (permissionGranted) {
const {
requestedPermission
} = conv.data;
if (requestedPermission === 'DEVICE_PRECISE_LOCATION') {
 
const {
coordinates
} = conv.device.location;
const city=conv.device.location.city;
const {location} = conv.device;
return conv.close(`You are at ${location.formattedAddress}`);

if (coordinates) {
return conv.close(`You are at ${coordinates.latitude}`);
} else {
// Note: Currently, precise locaton only returns lat/lng coordinates on phones and lat/lng coordinates
// and a geocoded address on voice-activated speakers.
// Coarse location only works on voice-activated speakers.
return conv.close('Sorry, I could not figure out where you are.');
}
 
}
} else {
return conv.close('Sorry, permission denied.');
}
});


exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
