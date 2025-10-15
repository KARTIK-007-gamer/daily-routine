// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
  import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyA4Roxq4ZirxQliyXwvbfZ499Ej2IAQdLc",
    authDomain: "daily-routine-map.firebaseapp.com",
    projectId: "daily-routine-map",
    storageBucket: "daily-routine-map.firebasestorage.app",
    messagingSenderId: "726387825653",
    appId: "1:726387825653:web:64575c365dd91085ce9ebc",
    measurementId: "G-F9H03EHS5H"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // Email/password login
  document.querySelector('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email  = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      // Username is optional and not used for login
      try {
          await signInWithEmailAndPassword(auth, email, password);
          alert('Login Successful');
          window.location.href = 'index.html';
      } catch (err) {
          alert('Login failed: ' + err.message);
      }
  });

  // Google login
  document.querySelector('.google-btn').addEventListener('click', async (e) => {
      e.preventDefault();
      try {
          await signInWithPopup(auth, provider);
          alert('Login Successful');
          window.location.href = 'index.html';
      } catch (err) {
          alert('Google login failed: ' + err.message);
      }
  });
