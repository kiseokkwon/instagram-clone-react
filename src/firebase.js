import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

firebase.initializeApp({
  apiKey: "AIzaSyApQIHn_5CfGsJs_8aci-1yoieMbh2XNGU",
  authDomain: "lge-instagram.firebaseapp.com",
  projectId: "lge-instagram",
  storageBucket: "lge-instagram.appspot.com",
  messagingSenderId: "570046665766",
  appId: "1:570046665766:web:be431b58b3a559894582e7",
  measurementId: "G-MLQ7N7FMEN",
});

const Persistence = {
  LOCAL: firebase.auth.Auth.Persistence.LOCAL,
};

const AuthProvider = {
  google: {
    get: new firebase.auth.GoogleAuthProvider(),
    id: "google.com",
  },
};

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage, Persistence, AuthProvider };
