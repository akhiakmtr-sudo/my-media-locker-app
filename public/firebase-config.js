// public/firebase-config.js

// This object contains the public-facing configuration for your Firebase project.
// It is required for your client-side JavaScript to connect to Firebase services.
// While stored in a separate file for organization, this information is still
// downloaded by the user's browser and is publicly accessible via developer tools.
// Firebase client-side security relies on Firebase Security Rules, not on
// the secrecy of these keys.
const firebaseConfig = {
  apiKey: "AIzaSyBPxI_-5oyVIECblHtfEBlc6EfKvS1C5JE",
  authDomain: "safe-locker-f0df1.firebaseapp.com",
  projectId: "safe-locker-f0df1",
  storageBucket: "safe-locker-f0df1.firebasestorage.app",
  messagingSenderId: "338082864321",
  appId: "1:338082864321:web:95d9bf7faff05e48194840"
};

// In this setup (using <script> tags), 'firebaseConfig' becomes a global variable.
// When 'app-logic.js' is loaded later, it can access this global variable.
