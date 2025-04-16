// Tab Switching
const encryptTab = document.getElementById('encryptTab');
const decryptTab = document.getElementById('decryptTab');
const encryptSection = document.getElementById('encryptSection');
const decryptSection = document.getElementById('decryptSection');
const decryptPreview = document.getElementById('decryptPreview');

// Initialize notification area
function createNotificationSystem() {
  const notificationArea = document.createElement('div');
  notificationArea.id = 'notificationArea';
  notificationArea.style.position = 'fixed';
  notificationArea.style.top = '20px';
  notificationArea.style.right = '20px';
  notificationArea.style.zIndex = '9999';
  notificationArea.style.maxWidth = '400px';
  document.body.appendChild(notificationArea);
  
  // Add privacy notice
  const privacyNotice = document.createElement('div');
  privacyNotice.style.backgroundColor = 'rgba(0, 172, 252, 0.8)';
  privacyNotice.style.color = 'white';
  privacyNotice.style.padding = '15px';
  privacyNotice.style.marginBottom = '10px';
  privacyNotice.style.borderRadius = '5px';
  privacyNotice.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  privacyNotice.innerHTML = '<strong>Privacy Notice:</strong> All encryption and decryption occurs directly on your device. No data is sent to any server, ensuring your files remain private and secure.';
  
  // Add close button
  const closeButton = document.createElement('span');
  closeButton.textContent = '×';
  closeButton.style.float = 'right';
  closeButton.style.cursor = 'pointer';
  closeButton.style.marginLeft = '10px';
  closeButton.style.fontSize = '20px';
  closeButton.style.lineHeight = '14px';
  closeButton.onclick = function() {
    privacyNotice.style.display = 'none';
  };
  
  privacyNotice.insertBefore(closeButton, privacyNotice.firstChild);
  notificationArea.appendChild(privacyNotice);
  
  return notificationArea;
}

// Create notification area ONCE
const notificationArea = createNotificationSystem();

function showPasswordNotification(duration = 20000) {
    const passwordNotice = document.createElement('div');
    passwordNotice.style.marginTop = '10px';
    passwordNotice.style.backgroundColor = 'rgba(0, 172, 252, 0.8)';
    passwordNotice.style.color = 'white';
    passwordNotice.style.padding = '15px';
    passwordNotice.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    passwordNotice.style.borderRadius = '5px';
    passwordNotice.style.marginBottom = '10px';
    passwordNotice.style.opacity = '1';
    passwordNotice.style.transition = 'opacity 0.5s ease-in-out';
    passwordNotice.innerHTML = `<strong>Password Notice:</strong> Please choose your password wisely and remember it. In case you forget your password or tell it to someone, we won't take responsibility.<br> Thank you`;
  
    const closeButton = document.createElement('span');
    closeButton.textContent = '×';
    closeButton.style.float = 'right';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginLeft = '10px';
    closeButton.style.fontSize = '20px';
    closeButton.style.lineHeight = '14px';
    closeButton.onclick = function () {
      passwordNotice.style.display = 'none';
    };
  
    passwordNotice.insertBefore(closeButton, passwordNotice.firstChild);
    notificationArea.appendChild(passwordNotice);
    
    // Auto dismiss after specified duration
    if (duration) {
      setTimeout(() => {
        passwordNotice.style.opacity = '0';
        setTimeout(() => {
          if (passwordNotice.parentNode) {
            passwordNotice.parentNode.removeChild(passwordNotice);
          }
        }, 500);
      }, duration);
    }
}

// Call the password notification function immediately to display it
showPasswordNotification();

// Function to show notifications instead of alerts
function showNotification(message, type = 'info', duration = 8000) {
  const notification = document.createElement('div');
  notification.style.backgroundColor = type === 'error' ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 172, 252, 0.8)';
  notification.style.color = 'white';
  notification.style.padding = '15px';
  notification.style.marginBottom = '10px';
  notification.style.borderRadius = '5px';
  notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  notification.style.opacity = '0';
  notification.style.transition = 'opacity 0.3s ease-in-out';
  
  // Add close button
  const closeButton = document.createElement('span');
  closeButton.textContent = '×';
  closeButton.style.float = 'right';
  closeButton.style.cursor = 'pointer';
  closeButton.style.marginLeft = '10px';
  closeButton.style.fontSize = '20px';
  closeButton.style.lineHeight = '14px';
  closeButton.onclick = function() {
    removeNotification();
  };
  
  notification.textContent = message;
  notification.insertBefore(closeButton, notification.firstChild);
  
  notificationArea.appendChild(notification);
  
  // Force reflow to enable transition
  notification.offsetHeight;
  notification.style.opacity = '1';
  
  function removeNotification() {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 500);
  }
  
  if (duration) {
    setTimeout(removeNotification, duration);
  }
  
  return {
    remove: removeNotification
  };
}

// Function to show notifications instead of alerts
function showNotification(message, type = 'info', duration = 8000) {
  const notification = document.createElement('div');
  notification.style.backgroundColor = type === 'error' ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 172, 252, 0.8)';
  notification.style.color = 'white';
  notification.style.padding = '15px';
  notification.style.marginBottom = '10px';
  notification.style.borderRadius = '5px';
  notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  notification.style.opacity = '0';
  notification.style.transition = 'opacity 0.3s ease-in-out';
  
  // Add close button
  const closeButton = document.createElement('span');
  closeButton.textContent = '×';
  closeButton.style.float = 'right';
  closeButton.style.cursor = 'pointer';
  closeButton.style.marginLeft = '10px';
  closeButton.style.fontSize = '20px';
  closeButton.style.lineHeight = '14px';
  closeButton.onclick = function() {
    removeNotification();
  };
  
  notification.textContent = message;
  notification.insertBefore(closeButton, notification.firstChild);
  
  notificationArea.appendChild(notification);
  
  // Force reflow to enable transition
  notification.offsetHeight;
  notification.style.opacity = '1';
  
  function removeNotification() {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }
  
  if (duration) {
    setTimeout(removeNotification, duration);
  }
  
  return {
    remove: removeNotification
  };
}

// Initially hide the decrypt preview
decryptPreview.style.display = 'none';

encryptTab.addEventListener('click', () => {
  encryptTab.classList.add('active');
  decryptTab.classList.remove('active');
  encryptSection.classList.add('active');
  decryptSection.classList.remove('active');
  // Hide decrypt preview when switching tabs
  decryptPreview.style.display = 'none';
});

decryptTab.addEventListener('click', () => {
  decryptTab.classList.add('active');
  encryptTab.classList.remove('active');
  decryptSection.classList.add('active');
  encryptSection.classList.remove('active');
  // Hide decrypt preview when switching tabs
  decryptPreview.style.display = 'none';
});

// Encrypt Section Logic
const fileInput = document.getElementById('encryptFile');
const encryptPreview = document.getElementById('encryptPreview');
const encryptPassword = document.getElementById('encryptPassword');
const encryptBtn = document.getElementById('encryptBtn');

// Store URLs for cleanup
let activeObjectURLs = [];

// Clean up object URLs to prevent memory leaks
function revokeAllObjectURLs() {
  activeObjectURLs.forEach(url => URL.revokeObjectURL(url));
  activeObjectURLs = [];
}

// Show file preview when selected for encryption
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    const { tier, maxFileSizeMB } = getDevicePerformanceTier();

    if (file && file.size > maxFileSizeMB * 1024 * 1024) {
      showNotification(`Your device is ${tier}-end. Max supported file size: ${maxFileSizeMB} MB. Please choose a smaller file.`, "error");
      fileInput.value = '';
      encryptPreview.innerHTML = '';
      return;
    }
    encryptPreview.innerHTML = '';
    
    // Revoke any existing object URLs first
    revokeAllObjectURLs();
    
    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      const objectUrl = URL.createObjectURL(file);
      activeObjectURLs.push(objectUrl);
      img.src = objectUrl;
      encryptPreview.appendChild(img);
    } else if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      const objectUrl = URL.createObjectURL(file);
      activeObjectURLs.push(objectUrl);
      video.src = objectUrl;
      video.controls = true;
      encryptPreview.appendChild(video);
    } else {
      // Add text preview for text files
      if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const textPreview = document.createElement('pre');
          textPreview.textContent = e.target.result.substring(0, 500) + (e.target.result.length > 500 ? '...' : '');
          encryptPreview.appendChild(textPreview);
        };
        reader.readAsText(file);
      } else {
        // For other file types, just show filename and size
        const fileInfo = document.createElement('div');
        fileInfo.textContent = `File: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
        encryptPreview.appendChild(fileInfo);
      }
    }
  }
});

// Helper function to safely convert ArrayBuffer to base64
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper function to convert base64 to ArrayBuffer
function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer; // Return buffer instead of typed array for compatibility
}

// Function to derive the key for encryption/decryption
async function deriveKey(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw", 
    enc.encode(password), 
    "PBKDF2", 
    false, 
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// Reset functionality for encrypt section
document.getElementById('resetEncryptBtn').addEventListener('click', () => {
  // Clear file input
  fileInput.value = '';
  // Clear password field
  encryptPassword.value = '';
  // Clear preview
  encryptPreview.innerHTML = '';
  // Revoke any existing object URLs
  revokeAllObjectURLs();
});

// Show loading indicator
function showLoading(element, isLoading) {
  if (isLoading) {
    element.disabled = true;
    element.textContent = "Processing...";
  } else {
    element.disabled = false;
    element.textContent = element.getAttribute('data-original-text') || element.textContent.replace("Processing...", "");
  }
}

// Store original button text
function storeOriginalText(button) {
  if (!button.getAttribute('data-original-text')) {
    button.setAttribute('data-original-text', button.textContent);
  }
}
// DRAG & DROP FOR ENCRYPT SECTION
const encryptDropArea = document.getElementById('encryptDropArea');
const encryptFileInput = document.getElementById('encryptFile');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  encryptDropArea.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
  }, false);
});

// Highlight when file is dragged over
['dragenter', 'dragover'].forEach(eventName => {
  encryptDropArea.addEventListener(eventName, () => {
    encryptDropArea.classList.add('active');
  }, false);
});

// Remove highlight when file leaves or is dropped
['dragleave', 'drop'].forEach(eventName => {
  encryptDropArea.addEventListener(eventName, () => {
    encryptDropArea.classList.remove('active');
  }, false);
});

// Handle drop
encryptDropArea.addEventListener('drop', (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;

  if (files.length) {
    encryptFileInput.files = files;
    // Trigger preview by simulating change event
    const event = new Event('change', { bubbles: true });
    encryptFileInput.dispatchEvent(event);
  }
});

// Click on area to open file picker
encryptDropArea.addEventListener('click', () => {
  encryptFileInput.click();
});


// Encryption process
encryptBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  const password = encryptPassword.value;

  if (!file || !password) {
    showNotification("Please provide both a file and a password!", "error");
    return;
  }
  
  if (password.length < 6) {
    showNotification("Password should be at least 6 characters long for security.", "error");
    return;
  }

  storeOriginalText(encryptBtn);
  showLoading(encryptBtn, true);

  try {
    const reader = new FileReader();
    reader.onload = async function (event) {
      try {
        const fileData = event.target.result;

        // Encrypt the file
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKey(password, salt);

        const encryptedData = await crypto.subtle.encrypt(
          { name: "AES-GCM", iv }, 
          key, 
          fileData
        );
        
        // Prepare encrypted content for download or further use
        const encryptedContent = {
          salt: arrayBufferToBase64(salt),
          iv: arrayBufferToBase64(iv),
          ciphertext: arrayBufferToBase64(encryptedData),
          filename: file.name,
          type: file.type, // Store the file type for proper decryption
          size: file.size, // Store original size for verification
          timestamp: new Date().toISOString() // Add timestamp for reference
        };

        // Convert encrypted content to JSON text
        const encryptedText = JSON.stringify(encryptedContent);

        // Create encrypted file for download
        const blob = new Blob([encryptedText], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file.name}.encrypted.json`;
        document.body.appendChild(a); // Append to body to ensure it works in all browsers
        a.click();
        document.body.removeChild(a);
        
        // Reset everything after download starts
        setTimeout(() => {
          URL.revokeObjectURL(url);
          showLoading(encryptBtn, false);
          showNotification("File encrypted and downloaded successfully!", "info");
          
          // Reset the form instead of switching tabs
          document.getElementById('resetEncryptBtn').click();
        }, 500);
        
      } catch (innerError) {
        console.error("Error in file processing:", innerError);
        showNotification("Error processing the file. The file might be too large or corrupted.", "error");
        showLoading(encryptBtn, false);
      }
    };

    reader.onerror = function() {
      console.error("FileReader error:", reader.error);
      showNotification("Error reading the file. Please try again with a different file.", "error");
      showLoading(encryptBtn, false);
    };

    reader.readAsArrayBuffer(file);
  } catch (error) {
    console.error("Encryption error:", error);
    showNotification("An error occurred during encryption. Please try again.", "error");
    showLoading(encryptBtn, false);
  }
});
// Replace the decryption logic with this improved version

// Drag and drop functionality
const decryptDropArea = document.getElementById('decryptDropArea');
const decryptFileInput = document.getElementById('decryptFile');

// Prevent default behavior for drag events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  decryptDropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
  decryptDropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  decryptDropArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
  decryptDropArea.classList.add('active');
}

function unhighlight() {
  decryptDropArea.classList.remove('active');
}

// Handle dropped files
decryptDropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  
  if (files.length) {
    decryptFileInput.files = files;
    displayFileName(files[0].name);
  }
}

// Click on drop area to select file
decryptDropArea.addEventListener('click', () => {
  decryptFileInput.click();
});

// Show file name when selected with file input
decryptFileInput.addEventListener('change', () => {
  if (decryptFileInput.files.length) {
    displayFileName(decryptFileInput.files[0].name);
  }
});

// Show selected file name
function displayFileName(name) {
  const messageElement = decryptDropArea.querySelector('.drag-drop-message');
  messageElement.innerHTML = `
    <i class='bx bx-file'></i>
    <p>Selected file: ${name}</p>
    <label for="decryptFile" class="file-label">Change File</label>
  `;
}

// Toggle password visibility for decrypt
const decryptPasswordInput = document.getElementById("decryptPassword");
const toggleDecryptEye = document.getElementById("toggleDecryptEye");

toggleDecryptEye.addEventListener("click", () => {
  const isHidden = decryptPasswordInput.type === "password";
  decryptPasswordInput.type = isHidden ? "text" : "password";

  toggleDecryptEye.classList.toggle("bx-show", !isHidden);
  toggleDecryptEye.classList.toggle("bx-hide", isHidden);
});

// Reset functionality for decrypt section
document.getElementById('resetDecryptBtn').addEventListener('click', () => {
  // Clear decrypt file input
  decryptFileInput.value = '';
  // Clear decrypt password
  decryptPasswordInput.value = '';
  // Hide decrypt preview
  decryptPreview.style.display = 'none';
  // Revoke any existing object URLs
  revokeAllObjectURLs();
  // Reset drag drop area
  const messageElement = decryptDropArea.querySelector('.drag-drop-message');
  messageElement.innerHTML = `
    <i class='bx bx-upload'></i>
    <p>Drag & drop your encrypted file here</p>
    <p>OR</p>
    <label for="decryptFile" class="file-label">Choose File</label>
  `;
});

// Decryption Logic
const decryptBtn = document.getElementById('decryptBtn');
decryptBtn.addEventListener('click', async () => {
  const password = document.getElementById('decryptPassword').value;
  
  if (!password) {
    showNotification("Please enter the password.", "error");
    return;
  }

  if (!decryptFileInput.files[0]) {
    showNotification("Please upload an encrypted file first.", "error");
    return;
  }

  storeOriginalText(decryptBtn);
  showLoading(decryptBtn, true);

  try {
    const fileText = await decryptFileInput.files[0].text();
    let encryptedData;
    
    try {
      encryptedData = JSON.parse(fileText);
    } catch (e) {
      showNotification("Invalid encrypted file format.", "error");
      showLoading(decryptBtn, false);
      return;
    }

    // Validate required properties
    if (!encryptedData.salt || !encryptedData.iv || !encryptedData.ciphertext) {
      throw new Error("Encrypted data is missing required properties");
    }

    // Decrypt the file
    const salt = base64ToArrayBuffer(encryptedData.salt);
    const iv = base64ToArrayBuffer(encryptedData.iv);
    const ciphertext = base64ToArrayBuffer(encryptedData.ciphertext);
    const key = await deriveKey(password, salt);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv }, 
      key, 
      ciphertext
    );

    // Create a Blob of the decrypted content with the correct MIME type
    const fileType = encryptedData.type || 'application/octet-stream';
    const decryptedBlob = new Blob([decrypted], { type: fileType });
    
    // Clear previous content and URLs
    const previewContent = document.getElementById('previewContent');
    previewContent.innerHTML = '';
    revokeAllObjectURLs();

    // Show preview based on file type
    const url = URL.createObjectURL(decryptedBlob);
    activeObjectURLs.push(url);
    
    if (fileType.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = url;
      previewContent.appendChild(img);
    } else if (fileType.startsWith('video/')) {
      const video = document.createElement('video');
      video.src = url;
      video.controls = true;
      previewContent.appendChild(video);
    } else if (fileType.startsWith('text/') || 
               fileType.startsWith('application/json') || 
               encryptedData.filename.endsWith('.txt') || 
               encryptedData.filename.endsWith('.json')) {
      // For text files, show a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const textPreview = document.createElement('pre');
        textPreview.textContent = e.target.result.substring(0, 500) + (e.target.result.length > 500 ? '...' : '');
        previewContent.appendChild(textPreview);
      };
      reader.readAsText(decryptedBlob);
    } else {
      // For other file types, just show a message with file info
      previewContent.innerHTML = `<p>File "${encryptedData.filename}" (${fileType}) decrypted successfully. Size: ${(decryptedBlob.size / 1024).toFixed(2)} KB. Click the download button below.</p>`;
    }

    // Show decrypt preview
    decryptPreview.style.display = 'block';
    
    // Set up download button
    const downloadButton = document.getElementById('downloadButton');
    const newDownloadButton = downloadButton.cloneNode(true);
    downloadButton.parentNode.replaceChild(newDownloadButton, downloadButton);

    newDownloadButton.addEventListener('click', () => {
      const downloadUrl = URL.createObjectURL(decryptedBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = encryptedData.filename || "decrypted_file";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Optional: revoke after a delay to ensure download works
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 3000);

      showNotification("File download started!", "info", 3000);
    });
    
    showNotification("File decrypted successfully! You can now view or download it.", "info");
  } catch (err) {
    console.error("Decryption error:", err);
    showNotification("Decryption failed: Incorrect password or corrupted data.", "error");
  } finally {
    showLoading(decryptBtn, false);
  }
});
// Cleanup on page unload to prevent memory leaks
window.addEventListener('beforeunload', revokeAllObjectURLs);






const encryptPasswordInput = document.getElementById("encryptPassword");
  const toggleEyeBtn = document.getElementById("toggleEncryptEye");

  toggleEyeBtn.addEventListener("click", () => {
    const isHidden = encryptPasswordInput.type === "password";
    encryptPasswordInput.type = isHidden ? "text" : "password";

    toggleEyeBtn.classList.toggle("bx-show", !isHidden);
    toggleEyeBtn.classList.toggle("bx-hide", isHidden);
  });




  // 🔍 1. Detect device performance tier
function getDevicePerformanceTier() {
  const ua = navigator.userAgent;
  const ram = navigator.deviceMemory || 4; // default fallback if not supported
  const cores = navigator.hardwareConcurrency || 4;

  if (ram <= 2 || cores <= 2 || /Android 5|iPhone 6|iPad mini|Moto E/.test(ua)) {
    return { tier: "low", maxFileSizeMB: 50 };
  } else if (ram <= 4 || cores <= 4 || /Android|iPhone/.test(ua)) {
    return { tier: "mid", maxFileSizeMB: 150 };
  } else {
    return { tier: "high", maxFileSizeMB: 700 };
  }
}


// 💬 2. Show center-screen device capability notification
function showDeviceLimitNotification() {
  const { tier, maxFileSizeMB } = getDevicePerformanceTier();

  const midNotice = document.createElement('div');
  midNotice.style.position = 'fixed';
  midNotice.style.top = '50%';
  midNotice.style.left = '50%';
  midNotice.style.transform = 'translate(-50%, -50%)';
  midNotice.style.zIndex = '9999';
  midNotice.style.backgroundColor = 'rgba(0, 172, 252, 0.95)';
  midNotice.style.color = 'white';
  midNotice.style.padding = '20px 30px';
  midNotice.style.borderRadius = '10px';
  midNotice.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
  midNotice.style.textAlign = 'center';
  midNotice.style.fontSize = '16px';
  midNotice.style.maxWidth = '90%';
  midNotice.style.lineHeight = '1.5';
  midNotice.style.opacity = '0';
  midNotice.style.transition = 'opacity 0.5s ease-in-out';
  midNotice.style.position = 'fixed';

  // Add close button
  const closeButton = document.createElement('span');
  closeButton.textContent = '×';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '10px';
  closeButton.style.right = '15px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontSize = '20px';
  closeButton.style.lineHeight = '20px';
  closeButton.style.color = 'white';
  closeButton.onclick = () => {
    midNotice.style.opacity = '0';
    setTimeout(() => midNotice.remove(), 500);
  };

  midNotice.innerHTML = `
    <strong>Device Capability Detected:</strong><br>
    You're on a <strong>${tier.toUpperCase()}-end device</strong>.<br>
    Recommended max file size: <strong>${maxFileSizeMB} MB</strong>.
    <br> <h4> Large video processing might be slow, please be patient </h4>
  `;
  midNotice.appendChild(closeButton);

  document.body.appendChild(midNotice);

  // Fade in
  setTimeout(() => midNotice.style.opacity = '1', 100);

  // Auto-remove after 8 seconds (optional, can remove if you want only manual close)
  setTimeout(() => {
    midNotice.style.opacity = '0';
    setTimeout(() => {
      if (midNotice.parentNode) midNotice.remove();
    }, 500);
  }, 8000);
}



// 🧠 Call this on page load
window.addEventListener('DOMContentLoaded', () => {
  showDeviceLimitNotification();
});
