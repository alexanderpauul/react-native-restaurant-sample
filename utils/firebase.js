import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAhvqE6PUA6KHT81V13ODuYf_xuYJKO8KA",
  authDomain: "react-native-restaurant-sample.firebaseapp.com",
  projectId: "react-native-restaurant-sample",
  storageBucket: "react-native-restaurant-sample.appspot.com",
  messagingSenderId: "39888140313",
  appId: "1:39888140313:web:44fe3f793ceee1aa371288",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);