// Supabase Configuration
const SUPABASE_URL = 'https://aiucftztmdwollabkosw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_QAavcZMryX9puqUSgaDbJw_veRrQdXR'; // ⚠️ Make sure this is your FULL key!

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Supabase connection error:', error);
  } else {
    console.log('✅ Supabase connected successfully!');
  }
});