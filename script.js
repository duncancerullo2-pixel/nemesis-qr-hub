// Nemesis QR Hub
// Supabase diagnostic test

const test = document.createElement("p");

test.style.cssText =
  "text-align:center;padding:15px;margin:20px;color:#39d353;font-weight:bold;";

test.textContent = "✓ script.js is running.";

document.body.appendChild(test);

console.log("Nemesis QR Hub: script.js is running.");

if (window.supabase) {
  test.textContent += " Supabase library is loaded.";
  console.log("Nemesis QR Hub: Supabase library is loaded.");
} else {
  test.textContent += " Supabase library is NOT loaded.";
  console.error("Nemesis QR Hub: Supabase library is NOT loaded.");
}
