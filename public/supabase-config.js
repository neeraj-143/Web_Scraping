// supabase-config.js
const SUPABASE_URL = 'https://aiucftztmdwollabkosw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_QAavcZMryX9puqUSgaDbJw_veRrQdXR';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test the connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Supabase connection error:', error);
    alert('Supabase key might be incorrect. Check console for details.');
  } else {
    console.log('✅ Supabase connected successfully!');
  }
});