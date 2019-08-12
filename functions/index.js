const functions = require('firebase-functions');
const app = require('express')();

const { getAllScreams } = require('./handlers/screams');
const { signup, login} = require ('./handlers/users');

const firebase = require('firebase');
firebase.initializeApp(config);


// Scream routes
app.get('/screams', getAllScreams);

// Post one scream
app.post('/scream', FBAuth, postOneScream);

// Signup route
app.post('/signup', signup);

//login route
app.post('/login', login);





exports.api = functions.https.onRequest(app);  