// Check if user is already logged in
async function checkAuth() {
  const { data: { user } } = await supabase.auth.getUser();
  
  // If logged in and on login/signup page, redirect to dashboard
  if (user && (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.includes('signup'))) {
    if (!window.location.pathname.includes('dashboard')) {
      window.location.href = 'dashboard.html';
      return;
    }
  }

  // If not logged in and on dashboard, redirect to login
  if (!user && window.location.pathname.includes('dashboard')) {
    window.location.href = 'index.html';
    return;
  }
  
  return user;
}

// Login Form Handler
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');
    const loginBtn = document.getElementById('loginBtn');
    
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      successDiv.textContent = '✅ Login successful! Redirecting...';
      successDiv.style.display = 'block';
      
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
      
    } catch (error) {
      errorDiv.textContent = `❌ ${error.message}`;
      errorDiv.style.display = 'block';
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
    }
  });
}

// Signup Form Handler
if (document.getElementById('signupForm')) {
  document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');
    const signupBtn = document.getElementById('signupBtn');
    
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    if (password !== confirmPassword) {
      errorDiv.textContent = '❌ Passwords do not match!';
      errorDiv.style.display = 'block';
      return;
    }
    
    signupBtn.disabled = true;
    signupBtn.textContent = 'Creating account...';
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      successDiv.textContent = '✅ Account created successfully! Redirecting to login...';
      successDiv.style.display = 'block';
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
      
    } catch (error) {
      errorDiv.textContent = `❌ ${error.message}`;
      errorDiv.style.display = 'block';
      signupBtn.disabled = false;
      signupBtn.textContent = 'Sign Up';
    }
  });
}

// Logout Function
async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Logout error:', error);
    alert('Error logging out. Please try again.');
  }
}

// Check authentication on page load
checkAuth();