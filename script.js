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
    "✓ Customer saved successfully.";
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
  /* =========================
     BUSINESS PROFILE MANAGEMENT
     ========================= */

  const profileCustomer =
    document.getElementById("profile-customer");

  const businessProfileFormContainer =
    document.getElementById(
      "business-profile-form-container"
    );

  const businessProfileForm =
    document.getElementById(
      "business-profile-form"
    );

  const cancelBusinessProfileButton =
    document.getElementById(
      "cancel-business-profile-button"
    );

  const businessProfileMessage =
    document.getElementById(
      "business-profile-message"
    );

  const businessProfileList =
    document.getElementById(
      "business-profile-list"
    );

  /* LOAD CUSTOMERS INTO BUSINESS PROFILE SELECT */

  async function loadProfileCustomers() {

    if (!profileCustomer) {
      return;
    }

    const {
      data: customers,
      error
    } = await supabase
      .from("customers")
      .select("id, name, customer_code")
      .order("created_at", { ascending: false });

    if (error) {

      console.error(
        "Profile customer loading failed:",
        error
      );

      return;
    }

    profileCustomer.innerHTML =
      '<option value="">Select a customer</option>';

    customers.forEach(function(customer) {

      const option =
        document.createElement("option");

      option.value = customer.id;

      option.textContent =
        customer.name +
        " (" +
        customer.customer_code +
        ")";

      profileCustomer.appendChild(option);

    });

  }


  /* SHOW BUSINESS PROFILE FORM */

  if (
    profileCustomer &&
    businessProfileFormContainer
  ) {

    profileCustomer.addEventListener(
      "change",
      function() {

        if (profileCustomer.value) {

          businessProfileFormContainer.hidden =
            false;

        } else {

          businessProfileFormContainer.hidden =
            true;

        }

      }
    );

  }


  await loadProfileCustomers();

  /* LOAD BUSINESS PROFILES */

  async function loadBusinessProfiles() {

    if (!businessProfileList) {
      return;
    }

    businessProfileList.innerHTML =
      "<p>Loading business profiles...</p>";

    const {
      data: profiles,
      error
    } = await supabase
      .from("business_profiles")
      .select(`
        id,
        customer_id,
        category,
        description,
        logo_url,
        phone,
        whatsapp,
        email,
        address,
        location_url,
        website_url,
        opening_hour,
        created_at
      `)
      .order(
        "created_at",
        { ascending: false }
      );

    if (error) {

      console.error(
        "Business profile loading failed:",
        error
      );

      businessProfileList.innerHTML =
        "<p>Unable to load business profiles: " +
        error.message +
        "</p>";

      return;
    }

    if (!profiles || profiles.length === 0) {

      businessProfileList.innerHTML =
        "<p>No business profiles yet.</p>";

      return;
    }

    businessProfileList.innerHTML = "";

    profiles.forEach(function(profile) {

      const profileCard =
        document.createElement("div");

      profileCard.className =
        "customer-item";

      profileCard.innerHTML = `
        <strong>${profile.category || "Business"}</strong>
        <span>${profile.description || ""}</span>
        <span>Phone: ${profile.phone || "Not provided"}</span>
        <span>WhatsApp: ${profile.whatsapp || "Not provided"}</span>
        <span>Email: ${profile.email || "Not provided"}</span>
        <span>Address: ${profile.address || "Not provided"}</span>
        <span>Opening: ${profile.opening_hour || "Not provided"}</span>
      `;

      businessProfileList.appendChild(
        profileCard
      );

    });

  }


  /* CANCEL BUSINESS PROFILE FORM */

  if (
    cancelBusinessProfileButton &&
    businessProfileFormContainer
  ) {

    cancelBusinessProfileButton.addEventListener(
      "click",
      function() {

        businessProfileFormContainer.hidden =
          true;

        if (businessProfileMessage) {
          businessProfileMessage.textContent =
            "";
        }

      }
    );

  }


  /* SAVE BUSINESS PROFILE */

  if (businessProfileForm) {

    businessProfileForm.addEventListener(
      "submit",
      async function(event) {

        event.preventDefault();

        const customerId =
          profileCustomer.value;

        const category =
          document.getElementById(
            "profile-category"
          ).value.trim();

        const description =
          document.getElementById(
            "profile-description"
          ).value.trim();

        const logoUrl =
          document.getElementById(
            "profile-logo-url"
          ).value.trim();

        const phone =
          document.getElementById(
            "profile-phone"
          ).value.trim();

        const whatsapp =
          document.getElementById(
            "profile-whatsapp"
          ).value.trim();

        const email =
          document.getElementById(
            "profile-email"
          ).value.trim();

        const address =
          document.getElementById(
            "profile-address"
          ).value.trim();

        const locationUrl =
          document.getElementById(
            "profile-location-url"
          ).value.trim();

        const websiteUrl =
          document.getElementById(
            "profile-website-url"
          ).value.trim();

        const openingHour =
          document.getElementById(
            "profile-opening-hour"
          ).value.trim();


        if (!customerId || !category) {

          if (businessProfileMessage) {
            businessProfileMessage.textContent =
              "Please select a customer and enter a category.";
          }

          return;
        }


        if (businessProfileMessage) {
          businessProfileMessage.textContent =
            "Saving business profile...";
        }


        const {
          error
        } = await supabase
          .from("business_profiles")
          .insert({

            customer_id: customerId,
            category: category,
            description: description,
            logo_url: logoUrl,
            phone: phone,
            whatsapp: whatsapp,
            email: email,
            address: address,
            location_url: locationUrl,
            website_url: websiteUrl,
            opening_hour: openingHour

          });


        if (error) {

          console.error(
            "Business profile save failed:",
            error
          );

          if (businessProfileMessage) {
            businessProfileMessage.textContent =
              "✗ Unable to save business profile: " +
              error.message;
          }

          return;
        }


        if (businessProfileMessage) {
          businessProfileMessage.textContent =
            "✓ Business profile saved successfully.";
        }


        businessProfileForm.reset();

        await loadBusinessProfiles();

      }
    );

  }

/* LOAD SERVICES */

const serviceCustomer =
  document.getElementById("service-customer");

const serviceFormContainer =
  document.getElementById("service-form-container");

const serviceForm =
  document.getElementById("service-form");

const cancelServiceButton =
  document.getElementById("cancel-service-button");

const serviceMessage =
  document.getElementById("service-message");

const serviceList =
  document.getElementById("service-list");


/* LOAD CUSTOMERS INTO SERVICES SELECT */

async function loadServiceCustomers() {

  if (!serviceCustomer) {
    return;
  }

  const {
    data: customers,
    error
  } = await supabase
    .from("customers")
    .select("id, name, customer_code")
    .order(
      "created_at",
      { ascending: false }
    );

  if (error) {

    console.error(
      "Service customer loading failed:",
      error
    );

    return;
  }

  serviceCustomer.innerHTML =
    '<option value="">Select a customer</option>';

  customers.forEach(function(customer) {

    const option =
      document.createElement("option");

    option.value = customer.id;

    option.textContent =
      customer.name +
      " (" +
      customer.customer_code +
      ")";

    serviceCustomer.appendChild(option);

  });

}


/* SHOW SERVICE FORM */

if (
  serviceCustomer &&
  serviceFormContainer
) {

  serviceCustomer.addEventListener(
    "change",
    function() {

      if (serviceCustomer.value) {

        serviceFormContainer.hidden =
          false;

        loadServices();

      } else {

        serviceFormContainer.hidden =
          true;

        if (serviceList) {

          serviceList.innerHTML =
            "<p>Select a customer to manage their services.</p>";

        }

      }

    }
  );

}


/* LOAD SERVICES */

async function loadServices() {

  if (
    !serviceCustomer ||
    !serviceList ||
    !serviceCustomer.value
  ) {

    return;

  }

  serviceList.innerHTML =
    "<p>Loading services...</p>";

  const {
    data: services,
    error
  } = await supabase
    .from("services")
    .select(`
      id,
      customer_id,
      name,
      description,
      price,
      image_url,
      sort_order,
      active
    `)
    .eq(
      "customer_id",
      serviceCustomer.value
    )
    .order(
      "sort_order",
      { ascending: true }
    );

  if (error) {

    console.error(
      "Services loading failed:",
      error
    );

    serviceList.innerHTML =
      "<p>Unable to load services: " +
      error.message +
      "</p>";

    return;
  }

  if (!services || services.length === 0) {

    serviceList.innerHTML =
      "<p>No services added for this customer yet.</p>";

    return;

  }

  serviceList.innerHTML = "";

  services.forEach(function(service) {

  const serviceCard =
    document.createElement("div");

  serviceCard.className =
    "customer-item";

  serviceCard.innerHTML = `
    <strong>${service.name || "Unnamed Service"}</strong>
    <span>${service.description || ""}</span>
    <span>Price: ${service.price ?? "Not provided"}</span>
    <span>Status: ${
      service.active ? "Active" : "Inactive"
    }</span>
    <span>Display Order: ${
      service.sort_order ?? 0
    }</span>
  `;

  const deleteButton =
    document.createElement("button");

  deleteButton.type = "button";

  deleteButton.className =
    "button secondary-button";

  deleteButton.textContent =
    "Delete Service";

  deleteButton.addEventListener(
    "click",
    async function() {

      const confirmed =
        confirm(
          "Delete this service?\n\n" +
          service.name
        );

      if (!confirmed) {
        return;
      }

      deleteButton.disabled = true;

      deleteButton.textContent =
        "Deleting...";

      const {
        error
      } = await supabase
        .from("services")
        .delete()
        .eq("id", service.id);

      if (error) {

        console.error(
          "Service deletion failed:",
          error
        );

        alert(
          "Unable to delete service: " +
          error.message
        );

        deleteButton.disabled = false;

        deleteButton.textContent =
          "Delete Service";

        return;
      }

      await loadServices();

    }
  );

  serviceCard.appendChild(
    deleteButton
  );

  serviceList.appendChild(
    serviceCard
  );

});

}


/* SAVE SERVICE */

if (serviceForm) {

  serviceForm.addEventListener(
    "submit",
    async function(event) {

      event.preventDefault();

      const customerId =
        serviceCustomer.value;

      const serviceName =
        document.getElementById(
          "service-name"
        ).value.trim();

      const serviceDescription =
        document.getElementById(
          "service-description"
        ).value.trim();

      const servicePrice =
        document.getElementById(
          "service-price"
        ).value;

      const serviceImageUrl =
        document.getElementById(
          "service-image-url"
        ).value.trim();

      const serviceSortOrder =
        document.getElementById(
          "service-sort-order"
        ).value;

      const serviceActive =
        document.getElementById(
          "service-active"
        ).value === "true";


      if (
        !customerId ||
        !serviceName
      ) {

        if (serviceMessage) {

          serviceMessage.textContent =
            "Please select a customer and enter a service name.";

        }

        return;

      }


      if (
        servicePrice === "" ||
        Number(servicePrice) < 0
      ) {

        if (serviceMessage) {

          serviceMessage.textContent =
            "Please enter a valid price.";

        }

        return;

      }


      if (serviceMessage) {

        serviceMessage.textContent =
          "Saving service...";

      }


      const {
        error
      } = await supabase
        .from("services")
        .insert({

      customer_id:
  customerId,

          name:
            serviceName,

          description:
            serviceDescription,

          price:
  Number(servicePrice),

          image_url:
            serviceImageUrl,

          sort_order:
            Number(serviceSortOrder || 0),

          active:
            serviceActive

        });


      if (error) {

        console.error(
          "Service save failed:",
          error
        );

        if (serviceMessage) {

          serviceMessage.textContent =
            "✗ Unable to save service: " +
            error.message;

        }

        return;

      }


      if (serviceMessage) {

        serviceMessage.textContent =
          "✓ Service saved successfully.";

      }


      serviceForm.reset();

      document.getElementById(
        "service-sort-order"
      ).value = "0";

      document.getElementById(
        "service-active"
      ).value = "true";


      await loadServices();

    }
  );

}


/* CANCEL SERVICE FORM */

if (
  cancelServiceButton &&
  serviceFormContainer
) {

  cancelServiceButton.addEventListener(
    "click",
    function() {

      serviceFormContainer.hidden =
        true;

      if (serviceMessage) {

        serviceMessage.textContent =
          "";

      }

    }
  );

}


/* LOAD SERVICES CUSTOMERS */

if (serviceCustomer) {

  await loadServiceCustomers();

  if (serviceCustomer.options.length > 1) {

    serviceCustomer.selectedIndex = 1;

    serviceFormContainer.hidden = false;

    await loadServices();

  }

}
/* =========================
   QR DESTINATION MANAGEMENT
   ========================= */

const destinationCustomer =
  document.getElementById("destination-customer");

const destinationFormContainer =
  document.getElementById(
    "destination-form-container"
  );

const destinationForm =
  document.getElementById("destination-form");

const cancelDestinationButton =
  document.getElementById(
    "cancel-destination-button"
  );

const destinationMessage =
  document.getElementById(
    "destination-message"
  );

const destinationList =
  document.getElementById("destination-list");


/* LOAD CUSTOMERS INTO DESTINATION SELECT */

async function loadDestinationCustomers() {

  if (!destinationCustomer) {
    return;
  }

  destinationCustomer.innerHTML =
    '<option value="">Select a customer</option>';

  if (
    serviceCustomer &&
    serviceCustomer.options.length > 1
  ) {

    Array.from(
      serviceCustomer.options
    ).forEach(function(option, index) {

      if (index === 0) {
        return;
      }

      const destinationOption =
        document.createElement("option");

      destinationOption.value =
        option.value;

      destinationOption.textContent =
        option.textContent;

      destinationCustomer.appendChild(
        destinationOption
      );

    });

  }

}


/* LOAD DESTINATIONS */

async function loadDestinations() {

  if (
    !destinationCustomer ||
    !destinationList ||
    !destinationCustomer.value
  ) {
    return;
  }

  destinationList.innerHTML =
    "<p>Loading destinations...</p>";

  const {
    data: destinations,
    error
  } = await supabase
    .from("qr_destinations")
    .select(`
      id,
      customer_id,
      slug,
      destination_type,
      status,
      created_at
    `)
    .eq(
      "customer_id",
      destinationCustomer.value
    )
    .order(
      "created_at",
      { ascending: false }
    );

  if (error) {

    console.error(
      "Destination loading failed:",
      error
    );

    destinationList.innerHTML =
      "<p>Unable to load destinations: " +
      error.message +
      "</p>";

    return;
  }

  if (
    !destinations ||
    destinations.length === 0
  ) {

    destinationList.innerHTML =
      "<p>No QR destinations added for this customer yet.</p>";

    return;
  }

  destinationList.innerHTML = "";

  destinations.forEach(
    function(destination) {

      const destinationCard =
        document.createElement("div");

      destinationCard.className =
        "customer-item";

      destinationCard.innerHTML = `
        <strong>${destination.slug}</strong>
        <span>Type: ${
          destination.destination_type
        }</span>
        <span>Status: ${
          destination.status
        }</span>
      `;

      destinationList.appendChild(
        destinationCard
      );

    }
  );

}


/* SHOW DESTINATION FORM */

if (
  destinationCustomer &&
  destinationFormContainer
) {

  destinationCustomer.addEventListener(
    "change",
    function() {

      if (destinationCustomer.value) {

        destinationFormContainer.hidden =
          false;

        loadDestinations();

      } else {

        destinationFormContainer.hidden =
          true;

        if (destinationList) {

          destinationList.innerHTML =
            "<p>Select a customer to manage QR destinations.</p>";

        }

      }

    }
  );

}


/* SAVE DESTINATION */

if (destinationForm) {

  destinationForm.addEventListener(
    "submit",
    async function(event) {

      event.preventDefault();

      const customerId =
        destinationCustomer.value;

      const slug =
        document.getElementById(
          "destination-slug"
        ).value.trim().toLowerCase();

      const destinationType =
        document.getElementById(
          "destination-type"
        ).value;

      const status =
        document.getElementById(
          "destination-status"
        ).value;


      if (
        !customerId ||
        !slug
      ) {

        if (destinationMessage) {

          destinationMessage.textContent =
            "Please select a customer and enter a destination slug.";

        }

        return;

      }


      if (destinationMessage) {

        destinationMessage.textContent =
          "Saving destination...";

      }


      const {
        error
      } = await supabase
        .from("qr_destinations")
        .insert({

          customer_id:
            customerId,

          slug:
            slug,

          destination_type:
            destinationType,

          status:
            status

        });


      if (error) {

        console.error(
          "Destination save failed:",
          error
        );

        if (destinationMessage) {

          destinationMessage.textContent =
            "✗ Unable to save destination: " +
            error.message;

        }

        return;

      }


      if (destinationMessage) {

        destinationMessage.textContent =
          "✓ QR destination saved successfully.";

      }


      destinationForm.reset();

      document.getElementById(
        "destination-type"
      ).value = "business";

      document.getElementById(
        "destination-status"
      ).value = "active";


      await loadDestinations();

    }
  );

}


/* CANCEL DESTINATION FORM */

if (
  cancelDestinationButton &&
  destinationFormContainer
) {

  cancelDestinationButton.addEventListener(
    "click",
    function() {

      destinationFormContainer.hidden =
        true;

      if (destinationMessage) {

        destinationMessage.textContent =
          "";

      }

    }
  );

}


/* LOAD DESTINATION CUSTOMERS */

if (destinationCustomer) {

  await loadDestinationCustomers();

    }
/* LOAD BUSINESS PROFILE LIST */

await loadBusinessProfiles();

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


