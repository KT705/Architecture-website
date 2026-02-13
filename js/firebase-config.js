// Firebase Configuration - Loaded from config.js

if (typeof window.APP_CONFIG === 'undefined') {
  console.error('Config not loaded! Make sure config.js is included before firebase-config.js');
} else {
  const firebaseConfig = window.APP_CONFIG.firebase;
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Initialize services (NO STORAGE - 100% FREE!)
  const auth = firebase.auth();
  const db = firebase.database();

  // Export for use in other files
  window.firebaseApp = {
    auth,
    db
  };
}