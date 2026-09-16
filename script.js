// Nemesis QR Hub
// Supabase + Admin Authentication

const SUPABASE_URL = "https://oioudjbgrtvkbqhwfosw.supabase.co";

// KEEP YOUR EXISTING PUBLISHABLE KEY HERE
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_eEJjuP4lyJ1AI7peckWdUg_6KvCkv_j";

async function startNemesisQR() {

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
console.log("NEMESIS QR SCRIPT IS RUNNING");
  
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

      const sessionResult = await Promise.race([
  supabase.auth.getSession(),
  new Promise(function(resolve) {
    setTimeout(function() {
      resolve({
        data: { session: null },
        error: new Error("Authentication session check timed out.")
      });
    }, 5000);
  })
]);

const session = sessionResult.data.session;
const sessionError = sessionResult.error;

if (sessionError || !session || !session.user) {

  console.error(
    "Session check failed:",
    sessionError
  );

  adminStatus.textContent =
    "✗ Session check failed. Please log in again.";

  setTimeout(function() {
    window.location.replace("login.html");
  }, 1500);

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
    /* =========================
     CUSTOMER MANAGEMENT
     ========================= */

  const addCustomerButton =
    document.getElementById("add-customer-button");

  const customerFormContainer =
    document.getElementById("customer-form-container");

  const cancelCustomerButton =
    document.getElementById("cancel-customer-button");

  const customerForm =
    document.getElementById("customer-form");

  const customerMessage =
    document.getElementById("customer-message");

  const customerList =
    document.getElementById("customer-list");


  /* SHOW CUSTOMER FORM */

  if (addCustomerButton && customerFormContainer) {

    addCustomerButton.addEventListener(
      "click",
      function() {

        customerFormContainer.hidden = false;
        addCustomerButton.hidden = true;

      }
    );

  }


  /* CANCEL CUSTOMER FORM */

  if (cancelCustomerButton && customerFormContainer) {

    cancelCustomerButton.addEventListener(
      "click",
      function() {

        customerFormContainer.hidden = true;

        if (addCustomerButton) {
          addCustomerButton.hidden = false;
        }

        if (customerMessage) {
          customerMessage.textContent = "";
        }

      }
    );

  }


  /* LOAD CUSTOMERS */

  async function loadCustomers() {

    if (!customerList) {
      return;
    }

    customerList.innerHTML =
      "<p>Loading customers...</p>";

    const {
      data: customers,
      error
    } = await supabase
      .from("customers")
      .select(
        "id, customer_code, customer_type, name, status, created_at"
      )
      .order(
        "created_at",
        { ascending: false }
      );

    if (error) {

      console.error(
        "Customer loading failed:",
        error
      );

    customerList.innerHTML =
  "<p>Unable to load customers: " +
  error.message +
  "</p>";
      return;
    }

    if (!customers || customers.length === 0) {

      customerList.innerHTML =
        "<p>No customers yet.</p>";

      return;
    }

    customerList.innerHTML = "";

    customers.forEach(function(customer) {

      const customerCard =
        document.createElement("div");

      customerCard.className =
        "customer-item";

      customerCard.innerHTML = `
        <strong>${customer.name}</strong>
        <span>Code: ${customer.customer_code}</span>
        <span>Type: ${customer.customer_type}</span>
        <span>Status: ${customer.status}</span>
      `;

      customerList.appendChild(customerCard);

    });

  }


  /* SAVE CUSTOMER */

  if (customerForm) {

    customerForm.addEventListener(
      "submit",
      async function(event) {

        event.preventDefault();

        const customerName =
          document.getElementById(
            "customer-name"
          ).value.trim();

        const customerType =
          document.getElementById(
            "customer-type"
          ).value;

        const customerStatus =
          document.getElementById(
            "customer-status"
          ).value;


        if (
          !customerName ||
          !customerType ||
          !customerStatus
        ) {

          if (customerMessage) {
            customerMessage.textContent =
              "Please complete all fields.";
          }

          return;
        }


        if (customerMessage) {
          customerMessage.textContent =
            "Saving customer...";
        }


        const customerCode =
          "NQR-" +
          Date.now().toString().slice(-8);


        const {
          error
        } = await supabase
          .from("customers")
          .insert({
            customer_code: customerCode,
            customer_type: customerType,
            name: customerName,
            status: customerStatus
          });


        if (error) {

          console.error(
            "Customer save failed:",
            error
          );

          if (customerMessage) {
            customerMessage.textContent =
              "✗ Unable to save customer.";
          }

          return;
        }


        if (customerMessage) {
        customerMessage.textContent =
  "✗ Unable to save customer: " +
  error.message;
        }


        customerForm.reset();

        document.getElementById(
          "customer-status"
        ).value = "active";


        await loadCustomers();


        setTimeout(function() {

          customerFormContainer.hidden = true;
          addCustomerButton.hidden = false;

          if (customerMessage) {
            customerMessage.textContent = "";
          }

        }, 1000);

      }
    );

  }


  /* LOAD CUSTOMER LIST */

  await loadCustomers();
}



/*
   =====================
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


