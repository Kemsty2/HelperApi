import admin from "firebase-admin";
import serviceAccount from "./helper-1531667858972-firebase-adminsdk-71m44-8345e4a200.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  //databaseURL: process.env.FIREBASE_DATABASE_URL
  databaseURL: "https://helper-1531667858972.firebaseio.com"
});

export default admin;
