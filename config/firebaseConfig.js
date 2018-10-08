import admin from "firebase-admin";
import serviceAccount from "./helper-1531667858972-firebase-adminsdk-71m44-856ac50837.json";
import "dotenv/config";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

export default admin;
