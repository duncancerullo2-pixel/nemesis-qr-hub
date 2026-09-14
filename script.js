// Nemesis QR Hub
// Supabase connection test

const SUPABASE_URL = "https://oioudjbgrtvkbqhwfosw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_eEJjuP4lyJ1AI7peckWdUg_6KvCkv_j";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

console.log("Nemesis QR Hub loaded successfully.");

supabase.auth.getSession().then(({ data, error }) => {
  const test = document.createElement("p");

  test.style.cssText =
    "text-align:center;padding:15px;margin:20px;color:#39d353;font-weight:bold;";

  if (error) {
    test.textContent = "Supabase connection test failed.";
    console.error(error);
  } else {
    test.textContent = "✓ Nemesis QR Hub connected to Supabase.";
    console.log("Supabase connection test successful.");
  }

  document.body.appendChild(test);
});
