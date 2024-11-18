// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.x.x/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    signOut 
} from "https://www.gstatic.com/firebasejs/9.x.x/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.x.x/firebase-firestore.js";

// Your Firebase configuration

    // Replace with your Firebase config object
    const firebaseConfig = {
 
        apiKey: "AIzaSyCrelCatMKLFsyEPOWitxzKamUUpzysqcQ",
       
        authDomain: "healthwise-app-fc27f.firebaseapp.com",
       
        projectId: "healthwise-app-fc27f",
       
        storageBucket: "healthwise-app-fc27f.appspot.com",
       
        messagingSenderId: "50687506324",
       
        appId: "1:50687506324:web:2d4b22c652bb0535060181",
       
        measurementId: "G-WDTFFJ2TH2"
       
      };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM elements
const adminSignInForm = document.getElementById('adminSignInForm');
const errorMessage = document.getElementById('errorMessage');

// Admin sign in function
async function signInAdmin(email, password) {
    try {
        // Sign in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if the user is an admin by querying Firestore
        const adminDocRef = doc(db, 'admins', user.uid);
        const adminDoc = await getDoc(adminDocRef);

        if (!adminDoc.exists()) {
            // If user is not an admin, sign them out and show error
            await signOut(auth);
            throw new Error('Unauthorized access. This portal is for admins only.');
        }

        // If successful, redirect to admin dashboard
        window.location.href = '/admin-dashboard.html';

    } catch (error) {
        // Show error message
        errorMessage.style.display = 'block';
        errorMessage.textContent = error.message;
    }
}

// Function to create new admin in Firestore
async function createAdmin(uid, email) {
    try {
        const adminDocRef = doc(db, 'admins', uid);
        await setDoc(adminDocRef, {
            email: email,
            role: 'admin',
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error creating admin document:', error);
        throw error;
    }
}

// Event listener for form submission
adminSignInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Clear previous error messages
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';

    await signInAdmin(email, password);
});

// Auth state observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Check if the user is on the sign-in page and redirect if necessary
        if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
            const adminDocRef = doc(db, 'admins', user.uid);
            getDoc(adminDocRef).then((doc) => {
                if (doc.exists()) {
                    window.location.href = '/admin-dashboard.html';
                }
            });
        }
    }
});
