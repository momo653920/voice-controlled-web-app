import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDF1o183IjyMTyAZnjn0z4Vx5GvYHs8uGc",
  authDomain: "voice-controlled-fms.firebaseapp.com",
  projectId: "voice-controlled-fms",
  storageBucket: "voice-controlled-fms.appspot.com",
  messagingSenderId: "632218011737",
  appId: "1:632218011737:web:be850e08d91652ea540948",
  measurementId: "G-GNP6LCRXPC",
};

firebase.initializeApp(firebaseConfig);

const fire = firebase;
const storage = firebase.storage();

export default fire;
export { storage };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
