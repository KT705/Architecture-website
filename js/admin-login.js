// Admin Login Logic

// Get Firebase auth from global scope
const loginAuth = window.firebaseApp.auth;

const loginForm = document.getElementById('loginForm');
const resetForm = document.getElementById('resetForm');
const loginCard = document.getElementById('loginCard');
const resetCard = document.getElementById('resetCard');
const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
const backToLoginBtn = document.getElementById('backToLoginBtn');

// Show/Hide Error Messages
function showMessage(elementId, message, isError = true) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.classList.remove('hidden');
  
  setTimeout(() => {
    element.classList.add('hidden');
  }, 5000);
}

// Toggle between Login and Reset Password
forgotPasswordBtn.addEventListener('click', () => {
  loginCard.classList.add('hidden');
  resetCard.classList.remove('hidden');
});

backToLoginBtn.addEventListener('click', () => {
  resetCard.classList.add('hidden');
  loginCard.classList.remove('hidden');
});

// Login Form Submit
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const userCredential = await loginAuth.signInWithEmailAndPassword(email, password);
    
    // Success - redirect to dashboard
    showMessage('loginSuccess', 'Login successful! Redirecting...', false);
    setTimeout(() => {
      window.location.href = 'admin-dashboard.html';
    }, 1000);
    
  } catch (error) {
    console.error('Login error:', error);
    
    let errorMessage = 'Login failed. Please try again.';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email format.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Try again later.';
    }
    
    showMessage('loginError', errorMessage);
  }
});

// Reset Password Form Submit
resetForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('resetEmail').value;

  try {
    await loginAuth.sendPasswordResetEmail(email);
    showMessage('resetSuccess', 'Password reset email sent! Check your inbox.', false);
    
    // Clear form
    resetForm.reset();
    
    // Go back to login after 3 seconds
    setTimeout(() => {
      resetCard.classList.add('hidden');
      loginCard.classList.remove('hidden');
    }, 3000);
    
  } catch (error) {
    console.error('Reset error:', error);
    
    let errorMessage = 'Failed to send reset email.';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email format.';
    }
    
    showMessage('resetError', errorMessage);
  }
});

// Check if user is already logged in
loginAuth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, redirect to dashboard
    window.location.href = 'admin-dashboard.html';
  }
});
