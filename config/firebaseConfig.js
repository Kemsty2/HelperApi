const admin = require("firebase-admin");

const serviceAccount = require("./helperapi-9d8ba-firebase-adminsdk-win8f-7024d28945.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://helperapi-9d8ba.firebaseio.com"
});

export default admin;
