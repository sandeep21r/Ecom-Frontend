// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXIb_zfmyNNdwWo_S-dY_7s8D-17JkPkY",
  authDomain: "clothify-auth-d7bb8.firebaseapp.com",
  projectId: "clothify-auth-d7bb8",
  storageBucket: "clothify-auth-d7bb8.firebasestorage.app",
  messagingSenderId: "720382295798",
  appId: "1:720382295798:web:65b90751abda42a76636d7",
  measurementId: "G-131NESP6QF"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
// REQUIRED for invisible recaptcha:
auth.settings.appVerificationDisabledForTesting = false;

export { auth, RecaptchaVerifier, signInWithPhoneNumber };