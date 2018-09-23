const admin = require("firebase-admin");

const serviceAccount = require("./helper-1531667858972-firebase-adminsdk-71m44-856ac50837.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://helperapi-9d8ba.firebaseio.com"
});

export default admin;
