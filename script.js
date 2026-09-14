// Nemesis QR Hub
// Supabase connection test

const SUPABASE_URL = "https://oioudjbgrtvkbqhwfosw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_eEJjuP4lyJ1AI7peckWdUg_6KvCkv_j";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

console.log("Nemesis QR Hub loaded successfully.");
console.log("Supabase client created:", !!supabase);
