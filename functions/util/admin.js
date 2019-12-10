
var admin = require("firebase-admin");

var serviceAccount = require("/Users/darveychang/Desktop/Project/ReactFire/reactfirebase-e36f4-firebase-adminsdk-q9h7v-b1d76bfebe.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://reactfirebase-e36f4.firebaseio.com"
});



// const admin = require('firebase-admin');

// admin.initializeApp();

const db = admin.firestore();

module.exports = { admin, db};