// Wait for Supabase library to load
(function() {
  // Your Supabase credentials
  const SUPABASE_URL = 'https://aiucftztmdwollabkosw.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdWNmdHp0bWR3b2xsYWJrb3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNTE3ODUsImV4cCI6MjA4MjcyNzc4NX0.Z7F5XerN3r8RFe6E6O4CcZU_11BGKLa31JtkD9N11V4'; // ⚠️ Paste your NEW key here!

  // Check if Supabase library is loaded
  if (typeof window.supabase === 'undefined') {
    console.error('❌ Supabase library not loaded!');
    return;
  }

  // Create Supabase client
  try {
    window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase initialized:', window.supabase);
  } catch (error) {
    console.error('❌ Error initializing Supabase:', error);
  }
})();