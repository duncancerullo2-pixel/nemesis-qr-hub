// Nemesis QR Hub
// Supabase connection + Admin Login

const SUPABASE_URL = "https://oioudjbgrtvkbqhwfosw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_eEJjuP4lyJ1AI7peckWdUg_6KvCkv_j";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

console.log("Nemesis QR Hub loaded successfully.");


/* ================================
   Admin Login
   ================================ */

const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

if (loginForm) {

  loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    loginMessage.textContent = "Signing in...";

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {

      loginMessage.textContent =
        "✗ Login failed. Please check your email and password.";

      console.error("Login error:", error);

      return;
    }

    console.log("Login successful:", data.user);

    loginMessage.textContent =
      "✓ Login successful. Opening dashboard...";

    setTimeout(function () {
      window.location.href = "dashboard.html";
    }, 800);

  });

}
