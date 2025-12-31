const SUPABASE_URL = 'https://aiucftztmdwollabkosw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdWNmdHp0bWR3b2xsYWJrb3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNTE3ODUsImV4cCI6MjA4MjcyNzc4NX0.Z7F5XerN3r8RFe6E6O4CcZU_11BGKLa31JtkD9N11V4';

if (!window.Supabase) {
  alert('❌ Supabase CDN failed to load');
}

window.supabase = window.Supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log('Supabase ready:', window.supabase);
console.log('Supabase auth:', window.supabase.auth);
