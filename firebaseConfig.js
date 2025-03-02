// // firebase.js
// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//     apiKey: "AIzaSyBmNhk28eBaRMewFMISwUoHrBWcMjP3Flg",
//     authDomain: "fyp-zikri.firebaseapp.com",
//     databaseURL: "https://fyp-zikri-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "fyp-zikri",
//     storageBucket: "fyp-zikri.firebasestorage.app",
//     messagingSenderId: "923160270514",
//     appId: "1:923160270514:web:3bd539b1f71d931f711bab",
//     measurementId: "G-6N480LQ3GN"
//   };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Realtime Database
// const database = getDatabase(app);

// // Initialize Firebase Authentication
// const auth = getAuth(app);

// export { database, auth };

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBmNhk28eBaRMewFMISwUoHrBWcMjP3Flg",
  authDomain: "fyp-zikri.firebaseapp.com",
  databaseURL: "https://fyp-zikri-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fyp-zikri",
  storageBucket: "fyp-zikri.firebasestorage.app",
  messagingSenderId: "923160270514",
  appId: "1:923160270514:web:3bd539b1f71d931f711bab",
  measurementId: "G-6N480LQ3GN",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { database, auth };
