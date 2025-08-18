// account.js
import { supabase } from "./supabaseClient.js";
 
// Get current logged-in user
async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
     // redirect if not logged in
    return null;
  }
  return data.user;
}

// Init account page
async function initAccountPage() {
  const user = await getCurrentUser();
  if (!user) return;

  // Show user email
  document.getElementById("userEmail").textContent = user.email;

  // Load encrypted files
  displayUserFiles(user.id);
}

initAccountPage();

// Display encrypted files from Supabase Storage
async function displayUserFiles(userId) {
  const fileListContainer = document.getElementById("fileList");
  fileListContainer.innerHTML = `<p>Loading your files...</p>`;

  const { data, error } = await supabase.storage
    .from("user-files")
    .list(`users/${userId}`);

  if (error) {
    fileListContainer.innerHTML = `<p style="color:red;">Error loading files: ${error.message}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    fileListContainer.innerHTML = `<p>No encrypted files found yet 🔒</p>`;
    return;
  }

  fileListContainer.innerHTML = "";
  for (let file of data) {
    if (file.name.endsWith(".encrypted.json")) {
      const { data: urlData } = supabase.storage
        .from("user-files")
        .getPublicUrl(`users/${userId}/${file.name}`);

      const div = document.createElement("div");
     // NEW AND IMPROVED CODE
const displayName = getDisplayName(file.name); // Get the clean name

div.innerHTML = `
  <div style="display:flex;justify-content:space-between;align-items:center;padding:8px;border-bottom:1px solid #444;">
    <span class="file-name" title="${file.name}">🔒 ${displayName}</span>
    <button class="download-btn">Download</button>
  </div>
`;

// Add a dedicated event listener for the button
div.querySelector('.download-btn').addEventListener('click', () => {
  window.downloadFile(urlData.publicUrl, file.name);
});
      fileListContainer.appendChild(div);
    }
  }
}

// Download helper
window.downloadFile = async (url, fileName) => {
  const res = await fetch(url);
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
};


// Helper function to create a clean display name
function getDisplayName(fullName) {
  // Remove the .encrypted.json suffix
  let name = fullName.replace(/\.encrypted\.json$/, "");
  // Find the last underscore, which separates the original name from the timestamp
  const lastUnderscoreIndex = name.lastIndexOf('_');
  // If an underscore is found, return the part before it (the original name)
  if (lastUnderscoreIndex > -1) {
    return name.substring(0, lastUnderscoreIndex);
  }
  // Otherwise, return the cleaned name as a fallback
  return name;
}