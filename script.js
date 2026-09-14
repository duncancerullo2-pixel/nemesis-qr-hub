// Nemesis QR Hub
// Supabase + Admin Authentication

const SUPABASE_URL = "https://oioudjbgrtvkbqhwfosw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_eEJjuP4lyJ1AI7peckWdUg_6KvCkv_j";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

console.log("Nemesis QR Hub loaded successfully.");


/* =================================
   ADMIN LOGIN
   ================================= */

const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

if (loginForm) {

  loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    loginMessage.textContent = "Signing in...";

    const { data, error } =
      await supabase.auth.signInWithPassword({
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


/* =================================
   ADMIN DASHBOARD SECURITY
   ================================= */

const adminStatus = document.getElementById("admin-status");
const logoutButton = document.getElementById("logout-button");

if (adminStatus) {

  async function checkAdminAccess() {

    adminStatus.textContent =
      "Checking administrator access...";

    const {
      data: { user },
      error: sessionError
    } = await supabase.auth.getUser();

    if (sessionError || !user) {

      console.warn("No authenticated user.");

      window.location.href = "login.html";

      return;
    }

    const { data: admin, error: adminError } =
      await supabase
        .from("admin_users")
        .select("id, role")
        .eq("auth_user_id", user.id)
        .in("role", ["owner", "admin"])
        .maybeSingle();

    if (adminError || !admin) {

      console.error("Administrator verification failed:", adminError);

      adminStatus.textContent =
        "✗ Administrator access denied.";

      await supabase.auth.signOut();

      setTimeout(function () {
        window.location.href = "login.html";
      }, 1500);

      return;
    }

    adminStatus.textContent =
      "✓ Administrator authenticated — " + admin.role;

    console.log(
      "Nemesis admin verified:",
      user.id,
      admin.role
    );
  }

  checkAdminAccess();
}


/* =================================
   SIGN OUT
   ================================= */

if (logoutButton) {

  logoutButton.addEventListener("click", async function () {

    logoutButton.textContent = "Signing out...";

    const { error } = await supabase.auth.signOut();

    if (error) {

      console.error("Sign out error:", error);

      logoutButton.textContent = "Sign Out";

      return;
    }

    window.location.href = "login.html";
  });
}
