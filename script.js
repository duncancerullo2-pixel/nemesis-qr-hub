// Nemesis QR Hub
// Supabase connection diagnostic

const SUPABASE_URL = "https://oioudjbgrtvkbqhwfosw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_eEJjuP4lyJ1AI7peckWdUg_6KvCkv_j";

const test = document.createElement("p");

test.style.cssText =
  "text-align:center;padding:15px;margin:20px;color:#39d353;font-weight:bold;";

test.textContent = "✓ script.js is running.";

document.body.appendChild(test);

console.log("Step 1: script.js is running.");

if (!window.supabase) {
  test.textContent = "✗ Supabase library is not loaded.";
  console.error("Step 2 failed: Supabase library is not loaded.");
} else {
  test.textContent = "✓ Supabase library loaded. Creating client...";

  console.log("Step 2: Supabase library loaded.");

  try {
    const supabase = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );

    test.textContent = "✓ Client created. Contacting Supabase...";

    console.log("Step 3: Supabase client created.");

    supabase.auth.getSession().then(({ error }) => {
      if (error) {
        test.textContent =
          "✗ Supabase responded with an error. Check the browser console.";
        console.error("Step 4: Supabase error:", error);
      } else {
        test.textContent =
          "✓ Supabase connection successful!";
        console.log("Step 4: Supabase responded successfully.");
      }
    }).catch((error) => {
      test.textContent =
        "✗ Supabase request failed.";
      console.error("Step 4: Supabase request failed:", error);
    });

  } catch (error) {
    test.textContent =
      "✗ Could not create Supabase client.";
    console.error("Step 3 failed:", error);
  }
}
