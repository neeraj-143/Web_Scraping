// Supabase Configuration
const SUPABASE_URL = 'https://aiucftztmdwollabkosw.supabase.co';
const SUPABASE_ANON_KEY = 'eeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdWNmdHp0bWR3b2xsYWJrb3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNTE3ODUsImV4cCI6MjA4MjcyNzc4NX0.Z7F5XerN3r8RFe6E6O4CcZU_11BGKLa31JtkD9N11V4yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdWNmdHp0bWR3b2xsYWJrb3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNTE3ODUsImV4cCI6MjA4MjcyNzc4NX0.Z7F5XerN3r8RFe6E6O4CcZU_11BGKLa31JtkD9N11V4'; // REQUIRED

// ✅ Correct way for Supabase v2 CDN
const supabase = window.Supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Optional test (safe)
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Supabase connection error:', error);
  } else {
    console.log('✅ Supabase connected successfully!');
  }
});
