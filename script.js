// Nemesis QR Hub
// Supabase + Admin Authentication

const SUPABASE_URL = "https://oioudjbgrtvkbqhwfosw.supabase.co";

// KEEP YOUR EXISTING PUBLISHABLE KEY HERE
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_eEJjuP4lyJ1AI7peckWdUg_6KvCkv_j";

function startNemesisQR() {

  if (!window.supabase) {
    const loginMessage = document.getElementById("login-message");
    const adminStatus = document.getElementById("admin-status");

    const message = "✗ Supabase library did not load.";

    if (loginMessage) loginMessage.textContent = message;
    if (adminStatus) adminStatus.textContent = message;

    return;
  }

  const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  console.log("Nemesis QR Hub loaded successfully.");

  /* =========================
     ADMIN LOGIN
     ========================= */

  const loginForm = document.getElementById("login-form");
  const loginMessage = document.getElementById("login-message");

  if (loginForm && loginMessage) {

    loginForm.addEventListener("submit", async function(event) {

      event.preventDefault();

      const email =
        document.getElementById("email").value.trim();

      const password =
        document.getElementById("password").value;

      const button =
        loginForm.querySelector("button[type='submit']");

      loginMessage.textContent = "Signing in...";

      if (button) {
        button.disabled = true;
      }

      try {

        const { data, error } =
          await supabase.auth.signInWithPassword({
            email: email,
            password: password
          });

        if (error) {

          loginMessage.textContent =
            "✗ " + error.message;

          console.error("Login error:", error);

          if (button) {
            button.disabled = false;
          }

          return;
        }

        if (!data || !data.user) {

          loginMessage.textContent =
            "✗ Login failed. No authenticated user was returned.";

          if (button) {
            button.disabled = false;
          }

          return;
        }

        loginMessage.textContent =
          "✓ Login successful. Opening dashboard...";

        setTimeout(function() {

          window.location.replace("dashboard.html");

        }, 700);

      } catch (error) {

        loginMessage.textContent =
          "✗ Login request failed: " +
          error.message;

        console.error(
          "Authentication request failed:",
          error
        );

        if (button) {
          button.disabled = false;
        }
      }

    });
  }


  /* =========================
     ADMIN DASHBOARD SECURITY
     ========================= */

  const adminStatus =
    document.getElementById("admin-status");

  const logoutButton =
    document.getElementById("logout-button");

  if (adminStatus) {

    async function checkAdminAccess() {

      adminStatus.textContent =
        "Checking administrator access...";

      try {

        const {
          data: { user },
          error: sessionError
        } = await supabase.auth.getUser();

        if (sessionError || !user) {

          window.location.replace("login.html");

          return;
        }

        const {
  data: isAdmin,
  error: adminError
} = await supabase.rpc("is_nemesis_admin");

if (adminError || !isAdmin) {

  console.error(
    "Administrator verification failed:",
    adminError
  );

  adminStatus.textContent =
    "✗ Administrator access denied.";

  await supabase.auth.signOut();

  setTimeout(function() {

    window.location.replace("login.html");

  }, 1200);

  return;
}

adminStatus.textContent =
  "✓ Administrator authenticated — Admin";

      } catch (error) {

        console.error(
          "Dashboard security check failed:",
          error
        );

        adminStatus.textContent =
          "✗ Administrator verification failed.";
      }
    }

    checkAdminAccess();
  }


  /* =========================
     SIGN OUT
     ========================= */

  if (logoutButton) {

    logoutButton.addEventListener(
      "click",
      async function() {

        logoutButton.textContent =
          "Signing out...";

        const { error } =
          await supabase.auth.signOut();

        if (error) {

          console.error(
            "Sign out error:",
            error
          );

          logoutButton.textContent =
            "Sign Out";

          return;
        }

        window.location.replace("login.html");
      }
    );
  }
}


/* =========================
   START APPLICATION
   ========================= */

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    startNemesisQR
  );

} else {

  startNemesisQR();

}
// Customer management
document.addEventListener("DOMContentLoaded", function () {
  const addCustomerButton = document.getElementById("add-customer-button");
  const customerFormContainer = document.getElementById("customer-form-container");
  const cancelCustomerButton = document.getElementById("cancel-customer-button");

  if (addCustomerButton && customerFormContainer) {
    addCustomerButton.addEventListener("click", function () {
      customerFormContainer.hidden = false;
      addCustomerButton.hidden = true;
    });
  }

  if (cancelCustomerButton && customerFormContainer) {
    cancelCustomerButton.addEventListener("click", function () {
      customerFormContainer.hidden = true;

      if (addCustomerButton) {
        addCustomerButton.hidden = false;
      }
    });
  }
});
