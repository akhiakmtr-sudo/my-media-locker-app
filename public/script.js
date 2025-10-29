// 1. Firebase Configuration (REPLACE WITH YOUR OWN FROM STEP 1.3)
const firebaseConfig = {
  apiKey: "AIzaSyBPxI_-5oyVIECblHtfEBlc6EfKvS1C5JE",
  authDomain: "safe-locker-f0df1.firebaseapp.com",
  projectId: "safe-locker-f0df1",
  storageBucket: "safe-locker-f0df1.firebasestorage.app",
  messagingSenderId: "338082864321",
  appId: "1:338082864321:web:95d9bf7faff05e48194840"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase service instances
const auth = firebase.auth();
const storage = firebase.storage();

// 2. DOM Elements
// Auth Page
const authPage = document.getElementById('auth-page');
const loginForm
