// public/app-logic.js

// Initialize Firebase using the firebaseConfig loaded from firebase-config.js
// This assumes firebase-config.js is loaded BEFORE this script in index.html
firebase.initializeApp(firebaseConfig); // firebaseConfig is now globally available

// Get Firebase service instances
const auth = firebase.auth();
const storage = firebase.storage();

// 2. DOM Elements
// Auth Page
const authPage = document.getElementById('auth-page');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const forgotPasswordForm = document.getElementById('forgot-password-form');

const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');

const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const signupBtn = document.getElementById('signupBtn');
const signupError = document.getElementById('signupError');

const forgotEmail = document.getElementById('forgotEmail');
const sendResetEmailBtn = document.getElementById('sendResetEmailBtn');
const forgotError = document.getElementById('forgotError');
const forgotSuccess = document.getElementById('forgotSuccess');

const showSignupLink = document.getElementById('showSignup');
const showLoginLink = document.getElementById('showLogin');
const showForgotLink = document.getElementById('showForgot'); // Ensure this element ID exists if used
const backToLoginLink = document.getElementById('backToLogin');

// Dashboard Page
const dashboardPage = document.getElementById('dashboard-page');
const userEmailDisplay = document.getElementById('userEmailDisplay');
const logoutBtn = document.getElementById('logoutBtn');

// File Uploads
const imageUpload = document.getElementById('imageUpload');
const videoUpload = document.getElementById('videoUpload');
const audioUpload = document.getElementById('audioUpload');
const documentUpload = document.getElementById('documentUpload');

const imageFilesDiv = document.getElementById('image-files');
const videoFilesDiv = document.getElementById('video-files');
const audioFilesDiv = document.getElementById('audio-files');
const documentFilesDiv = document.getElementById('document-files');

let currentUser = null; // To store the authenticated user object

// 3. UI Navigation Functions
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';
}

function showLoginForm() {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    forgotPasswordForm.style.display = 'none';
    loginError.textContent = '';
    signupError.textContent = '';
    forgotError.textContent = '';
    forgotSuccess.textContent = '';
}

function showSignupForm() {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    forgotPasswordForm.style.display = 'none';
    loginError.textContent = '';
    signupError.textContent = '';
    forgotError.textContent = '';
    forgotSuccess.textContent = '';
}

function showForgotPasswordForm() {
    loginForm.style.display = 'none';
    signupForm.style.display = 'none';
    forgotPasswordForm.style.display = 'block';
    loginError.textContent = '';
    signupError.textContent = '';
    forgotError.textContent = '';
    forgotSuccess.textContent = '';
}

// 4. Authentication Functions

// Listen for auth state changes
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        currentUser = user;
        userEmailDisplay.textContent = `Logged in as: ${user.email}`;
        showPage('dashboard-page');
        loadUserFiles(); // Load files for the logged-in user
    } else {
        // No user is signed in
        currentUser = null;
        showPage('auth-page');
        showLoginForm();
    }
});

// Signup
signupBtn.addEventListener('click', () => {
    const email = signupEmail.value;
    const password = signupPassword.value;
    signupError.textContent = '';

    if (!email || !password) {
        signupError.textContent = 'Email and password are required.';
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('User signed up:', userCredential.user.email);
            // Auth state change listener will handle showing dashboard
        })
        .catch((error) => {
            signupError.textContent = error.message;
            console.error('Signup error:', error);
        });
});

// Login
loginBtn.addEventListener('click', () => {
    const email = loginEmail.value;
    const password = loginPassword.value;
    loginError.textContent = '';

    if (!email || !password) {
        loginError.textContent = 'Email and password are required.';
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('User logged in:', userCredential.user.email);
            // Auth state change listener will handle showing dashboard
        })
        .catch((error) => {
            loginError.textContent = error.message;
            console.error('Login error:', error);
        });
});

// Forgot Password
sendResetEmailBtn.addEventListener('click', () => {
    const email = forgotEmail.value;
    forgotError.textContent = '';
    forgotSuccess.textContent = '';

    if (!email) {
        forgotError.textContent = 'Please enter your email.';
        return;
    }

    auth.sendPasswordResetEmail(email)
        .then(() => {
            forgotSuccess.textContent = 'Password reset email sent! Check your inbox.';
            forgotEmail.value = '';
        })
        .catch((error) => {
            forgotError.textContent = error.message;
            console.error('Forgot password error:', error);
        });
});

// Logout
logoutBtn.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            console.log('User logged out');
            // Auth state change listener will handle showing auth page
        })
        .catch((error) => {
            alert('Logout error: ' + error.message);
            console.error('Logout error:', error);
        });
});

// UI Link Event Listeners
showSignupLink.addEventListener('click', (e) => { e.preventDefault(); showSignupForm(); });
showLoginLink.addEventListener('click', (e) => { e.preventDefault(); showLoginForm(); });
if (showForgotLink) { // Check if element exists before adding listener
    showForgotLink.addEventListener('click', (e) => { e.preventDefault(); showForgotPasswordForm(); });
}
backToLoginLink.addEventListener('click', (e) => { e.preventDefault(); showLoginForm(); });


// 5. File Management Functions

// Helper to render a single file item
function renderFileItem(fileRef, folderDiv) {
    const fileName = fileRef.name;
    const fileItemDiv = document.createElement('div');
    fileItemDiv.className = 'file-item';
    fileItemDiv.dataset.filePath = fileRef.fullPath; // Store full path for delete/download

    const fileNameSpan = document.createElement('span');
    fileNameSpan.textContent = fileName;
    fileItemDiv.appendChild(fileNameSpan);

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Download';
    downloadBtn.addEventListener('click', () => downloadFile(fileRef));
    fileItemDiv.appendChild(downloadBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => deleteFile(fileRef, fileItemDiv));
    fileItemDiv.appendChild(deleteBtn);

    folderDiv.appendChild(fileItemDiv);
}

// Load all files for the current user
async function loadUserFiles() {
    if (!currentUser) return;

    // Clear previous lists
    imageFilesDiv.innerHTML = '';
    videoFilesDiv.innerHTML = '';
    audioFilesDiv.innerHTML = '';
    documentFilesDiv.innerHTML = '';

    const userId = currentUser.uid;
    const folders = ['images', 'videos', 'audios', 'documents'];

    for (const folder of folders) {
        // Using child for direct reference under user ID, then listing items
        const listRef = storage.ref(`users/${userId}/${folder}`);
        try {
            const res = await listRef.listAll();
            res.items.forEach((itemRef) => {
                let targetDiv;
                if (folder === 'images') targetDiv = imageFilesDiv;
                else if (folder === 'videos') targetDiv = videoFilesDiv;
                else if (folder === 'audios') targetDiv = audioFilesDiv;
                else if (folder === 'documents') targetDiv = documentFilesDiv;

                if (targetDiv) {
                    renderFileItem(itemRef, targetDiv);
                }
            });
        } catch (error) {
            console.error(`Error listing files in ${folder}:`, error);
            // For GitHub Pages, you might get "Storage bucket not found" if bucket path is wrong
            // or permission denied errors if rules are incorrect.
        }
    }
}

// Upload a file
function uploadFile(file, folderName) {
    if (!currentUser) {
        alert('You must be logged in to upload files.');
        return;
    }
    if (!file) {
        alert('Please select a file.');
        return;
    }

    const userId = currentUser.uid;
    const filePath = `users/${userId}/${folderName}/${file.name}`;
    const fileRef = storage.ref(filePath);
    const uploadTask = fileRef.put(file);

    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload to ${folderName} is ${progress.toFixed(2)}% done`);
            // You could update a progress bar here
        },
        (error) => {
            console.error('Upload failed:', error);
            alert('File upload failed: ' + error.message);
        },
        () => {
            console.log('File uploaded successfully!');
            alert('File uploaded successfully!');
            loadUserFiles(); // Refresh the file list
        }
    );
}

// Download a file
async function downloadFile(fileRef) {
    try {
        const url = await fileRef.getDownloadURL();
        // Create a temporary link and click it to trigger download
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank'; // Open in new tab, or remove for direct download
        a.download = fileRef.name; // Suggest original file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error downloading file:', error);
        alert('Could not download file: ' + error.message);
    }
}

// Delete a file
async function deleteFile(fileRef, fileItemDiv) {
    if (!confirm(`Are you sure you want to delete "${fileRef.name}"?`)) {
        return;
    }

    try {
        await fileRef.delete();
        console.log('File deleted successfully!');
        alert('File deleted!');
        fileItemDiv.remove(); // Remove from UI
        // Or re-call loadUserFiles() if you prefer a full refresh
    } catch (error) {
        console.error('Error deleting file:', error);
        alert('Could not delete file: ' + error.message);
    }
}

// 6. Event Listeners for Upload Buttons
imageUpload.addEventListener('change', (e) => uploadFile(e.target.files[0], 'images'));
videoUpload.addEventListener('change', (e) => uploadFile(e.target.files[0], 'videos'));
audioUpload.addEventListener('change', (e) => uploadFile(e.target.files[0], 'audios'));
documentUpload.addEventListener('change', (e) => uploadFile(e.target.files[0], 'documents'));

// Initial display setup
// This will be overridden by onAuthStateChanged but ensures correct initial state
showPage('auth-page');
showLoginForm();
