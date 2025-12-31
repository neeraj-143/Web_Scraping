// Check if user is already logged in
async function checkAuth() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user && (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html'))) {
    window.location.href = 'index.html';
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
        window.location.href = 'index.html';
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
        window.location.href = 'login.html';
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
  await supabase.auth.signOut();
  window.location.href = 'login.html';
}

// Check authentication on page load
checkAuth();