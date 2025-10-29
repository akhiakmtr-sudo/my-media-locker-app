// 1. Firebase Configuration (REPLACE WITH YOUR OWN FROM STEP 1.3)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // <--- REPLACE THIS
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com", // <--- REPLACE THIS
    projectId: "YOUR_PROJECT_ID", // <--- REPLACE THIS
    storageBucket: "YOUR_PROJECT_ID.appspot.com", // <--- REPLACE THIS
    messagingSenderId: "YOUR_SENDER_ID", // <--- REPLACE THIS
    appId: "YOUR_APP_ID" // <--- REPLACE THIS
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
