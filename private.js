// Add these imports at the top of your private.js file
import { supabase } from "./supabaseClient.js";
 


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
  
  const privacyNotice = document.createElement('div');
  privacyNotice.style.backgroundColor = 'rgba(0, 172, 252, 0.8)';
  privacyNotice.style.color = 'white';
  privacyNotice.style.padding = '15px';
  privacyNotice.style.marginBottom = '10px';
  privacyNotice.style.borderRadius = '5px';
  privacyNotice.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  privacyNotice.innerHTML = '<strong>Privacy Notice:</strong> All encryption and decryption occurs directly on your device. No data is sent to any server, ensuring your files remain private and secure.';
  
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

showPasswordNotification();

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

decryptPreview.style.display = 'none';

encryptTab.addEventListener('click', () => {
  encryptTab.classList.add('active');
  decryptTab.classList.remove('active');
  encryptSection.classList.add('active');
  decryptSection.classList.remove('active');
  decryptPreview.style.display = 'none';
});

decryptTab.addEventListener('click', () => {
  decryptTab.classList.add('active');
  encryptTab.classList.remove('active');
  decryptSection.classList.add('active');
  encryptSection.classList.remove('active');
  decryptPreview.style.display = 'none';
});

const fileInput = document.getElementById('encryptFile');
const encryptPreview = document.getElementById('encryptPreview');
const encryptPassword = document.getElementById('encryptPassword');
const encryptBtn = document.getElementById('encryptBtn');

let activeObjectURLs = [];

function revokeAllObjectURLs() {
  activeObjectURLs.forEach(url => URL.revokeObjectURL(url));
  activeObjectURLs = [];
}

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
      if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const textPreview = document.createElement('pre');
          textPreview.textContent = e.target.result.substring(0, 500) + (e.target.result.length > 500 ? '...' : '');
          encryptPreview.appendChild(textPreview);
        };
        reader.readAsText(file);
      } else {
        const fileInfo = document.createElement('div');
        fileInfo.textContent = `File: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
        encryptPreview.appendChild(fileInfo);
      }
    }
  }
});

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

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

document.getElementById('resetEncryptBtn').addEventListener('click', () => {
  fileInput.value = '';
  encryptPassword.value = '';
  encryptPreview.innerHTML = '';
  revokeAllObjectURLs();
});

function showLoading(element, isLoading) {
  if (isLoading) {
    element.disabled = true;
    element.textContent = "Processing...";
  } else {
    element.disabled = false;
    element.textContent = element.getAttribute('data-original-text') || element.textContent.replace("Processing...", "");
  }
}

function storeOriginalText(button) {
  if (!button.getAttribute('data-original-text')) {
    button.setAttribute('data-original-text', button.textContent);
  }
}

const encryptDropArea = document.getElementById('encryptDropArea');
const encryptFileInput = document.getElementById('encryptFile');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  encryptDropArea.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
  }, false);
});

['dragenter', 'dragover'].forEach(eventName => {
  encryptDropArea.addEventListener(eventName, () => {
    encryptDropArea.classList.add('active');
  }, false);
});

['dragleave', 'drop'].forEach(eventName => {
  encryptDropArea.addEventListener(eventName, () => {
    encryptDropArea.classList.remove('active');
  }, false);
});

encryptDropArea.addEventListener('drop', (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;

  if (files.length) {
    encryptFileInput.files = files;
    const event = new Event('change', { bubbles: true });
    encryptFileInput.dispatchEvent(event);
  }
});

encryptDropArea.addEventListener('click', () => {
  encryptFileInput.click();
});

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
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKey(password, salt);

        const encryptedData = await crypto.subtle.encrypt(
          { name: "AES-GCM", iv }, 
          key, 
          fileData
        );
        
        const encryptedContent = {
          salt: arrayBufferToBase64(salt),
          iv: arrayBufferToBase64(iv),
          ciphertext: arrayBufferToBase64(encryptedData),
          filename: file.name,
          type: file.type,
          size: file.size,
          timestamp: new Date().toISOString()
        };

        const encryptedText = JSON.stringify(encryptedContent);
        const blob = new Blob([encryptedText], { type: 'application/json' });

        showStorageOptionNotification(blob, file.name);

        showLoading(encryptBtn, false);
        document.getElementById('resetEncryptBtn').click();
        
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

const decryptDropArea = document.getElementById('decryptDropArea');
const decryptFileInput = document.getElementById('decryptFile');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  decryptDropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

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

decryptDropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  
  if (files.length) {
    decryptFileInput.files = files;
    displayFileName(files[0].name);
  }
}

decryptDropArea.addEventListener('click', () => {
  decryptFileInput.click();
});

decryptFileInput.addEventListener('change', () => {
  if (decryptFileInput.files.length) {
    displayFileName(decryptFileInput.files[0].name);
  }
});

function displayFileName(name) {
  const messageElement = decryptDropArea.querySelector('.drag-drop-message');
  messageElement.innerHTML = `
    <i class='bx bx-file'></i>
    <p>Selected file: ${name}</p>
    <label for="decryptFile" class="file-label">Change File</label>
  `;
}

const decryptPasswordInput = document.getElementById("decryptPassword");
const toggleDecryptEye = document.getElementById("toggleDecryptEye");

toggleDecryptEye.addEventListener("click", () => {
  const isHidden = decryptPasswordInput.type === "password";
  decryptPasswordInput.type = isHidden ? "text" : "password";
  toggleDecryptEye.classList.toggle("bx-show", !isHidden);
  toggleDecryptEye.classList.toggle("bx-hide", isHidden);
});

document.getElementById('resetDecryptBtn').addEventListener('click', () => {
  decryptFileInput.value = '';
  decryptPasswordInput.value = '';
  decryptPreview.style.display = 'none';
  revokeAllObjectURLs();
  const messageElement = decryptDropArea.querySelector('.drag-drop-message');
  messageElement.innerHTML = `
    <i class='bx bx-upload'></i>
    <p>Drag & drop your encrypted file here</p>
    <p>OR</p>
    <label for="decryptFile" class="file-label">Choose File</label>
  `;
});

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

    if (!encryptedData.salt || !encryptedData.iv || !encryptedData.ciphertext) {
      throw new Error("Encrypted data is missing required properties");
    }

    const salt = base64ToArrayBuffer(encryptedData.salt);
    const iv = base64ToArrayBuffer(encryptedData.iv);
    const ciphertext = base64ToArrayBuffer(encryptedData.ciphertext);
    const key = await deriveKey(password, salt);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv }, 
      key, 
      ciphertext
    );

    const fileType = encryptedData.type || 'application/octet-stream';
    const decryptedBlob = new Blob([decrypted], { type: fileType });
    
    const previewContent = document.getElementById('previewContent');
    previewContent.innerHTML = '';
    revokeAllObjectURLs();

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
      const reader = new FileReader();
      reader.onload = (e) => {
        const textPreview = document.createElement('pre');
        textPreview.textContent = e.target.result.substring(0, 500) + (e.target.result.length > 500 ? '...' : '');
        previewContent.appendChild(textPreview);
      };
      reader.readAsText(decryptedBlob);
    } else {
      previewContent.innerHTML = `<p>File "${encryptedData.filename}" (${fileType}) decrypted successfully. Size: ${(decryptedBlob.size / 1024).toFixed(2)} KB. Click the download button below.</p>`;
    }

    decryptPreview.style.display = 'block';
    
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

window.addEventListener('beforeunload', revokeAllObjectURLs);

const encryptPasswordInput = document.getElementById("encryptPassword");
const toggleEyeBtn = document.getElementById("toggleEncryptEye");

toggleEyeBtn.addEventListener("click", () => {
  const isHidden = encryptPasswordInput.type === "password";
  encryptPasswordInput.type = isHidden ? "text" : "password";
  toggleEyeBtn.classList.toggle("bx-show", !isHidden);
  toggleEyeBtn.classList.toggle("bx-hide", isHidden);
});

function getDevicePerformanceTier() {
  const ua = navigator.userAgent;
  const ram = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;

  if (ram <= 2 || cores <= 2 || /Android 5|iPhone 6|iPad mini|Moto E/.test(ua)) {
    return { tier: "low", maxFileSizeMB: 50 };
  } else if (ram <= 4 || cores <= 4 || /Android|iPhone/.test(ua)) {
    return { tier: "mid", maxFileSizeMB: 150 };
  } else {
    return { tier: "high", maxFileSizeMB: 700 };
  }
}

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
  setTimeout(() => midNotice.style.opacity = '1', 100);

  setTimeout(() => {
    midNotice.style.opacity = '0';
    setTimeout(() => {
      if (midNotice.parentNode) midNotice.remove();
    }, 500);
  }, 8000);
}

window.addEventListener('DOMContentLoaded', () => {
  showDeviceLimitNotification();
});



// ⭐ NEW: Function to get the number of files a user has stored
async function getUserFileCount(userId) {
  if (!userId) {
    console.error("User ID is required to count files.");
    return 0;
  }
  
  const { data, error } = await supabase.storage
    .from("user-files")
    .list(`users/${userId}`);

  if (error) {
    console.error("Error fetching file list:", error);
    return 0; 
  }
  
  return data ? data.length : 0;
}

function showStorageOptionNotification(encryptedBlob, originalFileName) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border: 2px solid #00d4ff;
    color: white;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 212, 255, 0.15), 0 0 40px rgba(0, 212, 255, 0.1);
    max-width: 480px;
    width: 92%;
    text-align: center;
    font-family: 'Poppins', sans-serif;
    animation: slideIn 0.3s ease-out;
    backdrop-filter: blur(10px);
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { opacity: 0; transform: translate(-50%, -60%); }
      to { opacity: 1; transform: translate(-50%, -50%); }
    }
    .storage-btn {
      margin: 8px 6px;
      padding: 14px 24px;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      font-size: 14px;
      position: relative;
      overflow: hidden;
    }
    .primary-btn {
      background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
    }
    .primary-btn:hover {
      background: linear-gradient(135deg, #0099cc 0%, #007aa3 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 212, 255, 0.4);
    }
    .secondary-btn {
      background: transparent;
      color: #ffffff;
      border: 2px solid rgba(255,255,255,0.3);
    }
    .secondary-btn:hover {
      background: rgba(255,255,255,0.1);
      border-color: rgba(255,255,255,0.5);
      transform: translateY(-1px);
    }
    .rename-input {
      width: calc(100% - 20px);
      padding: 14px;
      margin: 15px 0;
      border: 2px solid rgba(0, 212, 255, 0.3);
      border-radius: 10px;
      background: rgba(255,255,255,0.05);
      color: white;
      font-size: 14px;
      backdrop-filter: blur(5px);
    }
    .rename-input:focus {
      outline: none;
      border-color: #00d4ff;
      background: rgba(255,255,255,0.1);
    }
    .rename-input::placeholder {
      color: rgba(255,255,255,0.6);
    }
    .beta-badge {
      display: inline-block;
      background: linear-gradient(135deg, #ff4757 0%, #ff3742 100%);
      color: white;
      padding: 4px 10px;
      border-radius: 15px;
      font-size: 11px;
      font-weight: 700;
      margin-left: 8px;
      box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
    }
    .trust-info {
      background: rgba(0, 212, 255, 0.1);
      border: 1px solid rgba(0, 212, 255, 0.2);
      padding: 16px;
      border-radius: 12px;
      margin: 20px 0;
      font-size: 13px;
      line-height: 1.5;
    }
    .beta-warning {
      background: rgba(255, 193, 7, 0.15);
      border: 1px solid rgba(255, 193, 7, 0.3);
      padding: 10px;
      border-radius: 8px;
      margin: 15px 0;
      font-size: 12px;
      color: #ffc107;
    }
  `;
  document.head.appendChild(style);

  notification.innerHTML = `
    <div style="margin-bottom: 20px;">
      <div style="font-size: 28px; margin-bottom: 12px;">🎉</div>
      <h3 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600;">
        File Encrypted Successfully!
        <span class="beta-badge">BETA</span>
      </h3>
      <p style="margin: 0; font-size: 15px; opacity: 0.85; color: #e0e0e0;">
        Secure cloud backup for cross-device access?
      </p>
    </div>
    
    <div class="trust-info">
      <div style="font-weight: 600; margin-bottom: 8px; color: #00d4ff;">
        🔒 Why backup encrypted files?
      </div>
      <div style="margin-bottom: 10px; text-align: left; color: #f0f0f0;">
        ✓ Device lost/stolen? Access from anywhere<br>
        ✓ File accidentally deleted? Safe backup<br>
        ✓ Need on multiple devices? One-click access
      </div>
      <div style="font-weight: 600; color: #00d4ff; font-size: 13px;">
        🛡️ We only store encrypted data - impossible to decrypt without your password
      </div>
    </div>

    <div class="beta-warning">
      <strong>⚠️ Beta Phase:</strong> Max 2 files • 20MB total storage
    </div>
    
    <div id="storageOptions">
      <button class="storage-btn primary-btn" id="saveToCloud">
        ☁️ Backup Encrypted File
      </button>
      <button class="storage-btn secondary-btn" id="downloadOnly">
        📥 Download Only
      </button>
    </div>
    
    <div id="renameSection" style="display: none; margin-top: 15px;">
      <input type="text" class="rename-input" id="customFileName" 
             placeholder="Enter file name (optional)" 
             value="${originalFileName}">
      <div>
        <button class="storage-btn primary-btn" id="confirmSave">Save to Cloud</button>
        <button class="storage-btn secondary-btn" id="cancelSave">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(notification);
  
  function removeNotification() {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  // Button click handler with updated file limit check
  document.getElementById('saveToCloud').onclick = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      removeNotification();
      showLoginPrompt();
      return;
    }

    // Check file count and total size before proceeding
    const { fileCount, totalSize } = await getUserStorageInfo(user.id);
    const BETA_FILE_LIMIT = 2;
    const BETA_SIZE_LIMIT = 20 * 1024 * 1024; // 20MB in bytes
    const currentFileSize = encryptedBlob.size;

    if (fileCount >= BETA_FILE_LIMIT) {
      removeNotification();
      showBetaLimitPrompt('files');
      return;
    }

    if (totalSize + currentFileSize > BETA_SIZE_LIMIT) {
      removeNotification();
      showBetaLimitPrompt('size');
      return;
    }

    // If under limits, proceed to rename/save
    document.getElementById('storageOptions').style.display = 'none';
    document.getElementById('renameSection').style.display = 'block';
  };

// Updated getUserStorageInfo function
async function getUserStorageInfo(userId) {
  if (!userId) {
    console.error("User ID is required to get storage info.");
    return { fileCount: 0, totalSize: 0 };
  }
  
  const { data, error } = await supabase.storage
    .from("user-files")
    .list(`users/${userId}`);

  if (error) {
    console.error("Error fetching file list:", error);
    return { fileCount: 0, totalSize: 0 };
  }
  
  const fileCount = data ? data.length : 0;
  const totalSize = data ? data.reduce((sum, file) => sum + (file.metadata?.size || 0), 0) : 0;
  
  return { fileCount, totalSize };
}

// Updated beta limit prompt
function showBetaLimitPrompt(limitType) {
  const limitNotif = document.createElement('div');
  limitNotif.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10001;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border: 2px solid #ff4757;
    color: white;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(255, 71, 87, 0.15), 0 0 40px rgba(255, 71, 87, 0.1);
    max-width: 420px;
    width: 90%;
    text-align: center;
    font-family: 'Poppins', sans-serif;
    backdrop-filter: blur(10px);
  `;

  const limitMessage = limitType === 'files' 
    ? 'You\'ve reached the beta limit of 2 files.' 
    : 'Adding this file would exceed the 20MB beta storage limit.';

  limitNotif.innerHTML = `
    <div style="font-size: 28px; margin-bottom: 15px;">⚠️</div>
    <h3 style="margin: 0 0 15px 0; font-weight: 600; color: #ff4757;">Beta Limit Reached</h3>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #e0e0e0;">
      ${limitMessage}
    </p>
    <div style="background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.2); padding: 16px; border-radius: 12px; margin: 20px 0;">
      <h4 style="margin:0 0 10px 0; color: #00d4ff;">🔒 Your encrypted files remain secure</h4>
      <p style="margin:0; font-size: 13px; color: #f0f0f0; line-height: 1.4;">
        Download and decrypt them anytime on any device using your password
      </p>
    </div>
    <p style="margin:0 0 10px 0;">Option for <span style="color: #00d4ff;">Premium </span>will be</p>
    <button style="
      margin-top: 20px;
      padding: 14px 24px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 12px;
      background: transparent;
      color: white;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
    " id="closeLimitPrompt" 
    onmouseover="this.style.background='rgba(255,255,255,0.1)'; this.style.borderColor='rgba(255,255,255,0.5)'"
    onmouseout="this.style.background='transparent'; this.style.borderColor='rgba(255,255,255,0.3)'">
      Got it - Continue Download
    </button>
  `;

  document.body.appendChild(limitNotif);

  document.getElementById('closeLimitPrompt').onclick = () => {
    downloadFile(encryptedBlob, `${originalFileName}.encrypted.json`);
    
    limitNotif.remove();
  };
}

  document.getElementById('downloadOnly').onclick = () => {
    removeNotification();
    downloadFile(encryptedBlob, `${originalFileName}.encrypted.json`);
  };

  document.getElementById('confirmSave').onclick = async () => {
    const customName = document.getElementById('customFileName').value.trim();
    const finalName = customName || originalFileName;

    const confirmButton = document.getElementById('confirmSave');
    confirmButton.textContent = 'Saving...';
    confirmButton.disabled = true;

    try {
      await saveToCloud(encryptedBlob, finalName);
      removeNotification();
      showSuccessNotification('File backed up to cloud and downloaded! 🎉');
      downloadFile(encryptedBlob, `${finalName}.encrypted.json`);
    } catch (error) {
      console.error('Error saving to cloud:', error);
      showNotification('Failed to backup to cloud. File downloaded instead.', 'error');
      downloadFile(encryptedBlob, `${finalName}.encrypted.json`);
      removeNotification();
    }
  };

  document.getElementById('cancelSave').onclick = () => {
    removeNotification();
    downloadFile(encryptedBlob, `${originalFileName}.encrypted.json`);
  };

  setTimeout(() => {
    if (notification.parentNode) {
      removeNotification();
      downloadFile(encryptedBlob, `${originalFileName}.encrypted.json`);
    }
  }, 30000);
}

function showLoginPrompt() {
  const loginNotif = document.createElement('div');
  loginNotif.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10001;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    max-width: 400px;
    width: 90%;
    text-align: center;
    font-family: 'Poppins', sans-serif;
  `;

  loginNotif.innerHTML = `
    <div style="font-size: 24px; margin-bottom: 10px;">🔐</div>
    <h3 style="margin: 0 0 10px 0;">Login Required</h3>
    <p style="margin: 0 0 20px 0; font-size: 14px;">
      Please login to save files to your cloud account
    </p>
    <button class="storage-btn primary-btn" onclick="window.location.href='login.html'">
      Login Now
    </button>
    <button class="storage-btn secondary-btn" id="skipLogin">
      Skip & Download
    </button>
  `;

  document.body.appendChild(loginNotif);

  document.getElementById('skipLogin').onclick = () => {
    loginNotif.remove();
  };

  setTimeout(() => {
    if (loginNotif.parentNode) {
      loginNotif.remove();
    }
  }, 15000);
}

async function saveToCloud(encryptedBlob, fileName) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const uniqueFileName = `${fileName}_${timestamp}.encrypted.json`;
  const filePath = `users/${user.id}/${uniqueFileName}`;

  const { data, error } = await supabase.storage
    .from('user-files')
    .upload(filePath, encryptedBlob, {
      contentType: 'application/json',
      upsert: false
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw error;
  }

  return data;
}

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
a.click();
  document.body.removeChild(a);
  
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function showSuccessNotification(message) {
  const successNotif = document.createElement('div');
  successNotif.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    background: linear-gradient(135deg, #00d4ff 0%, #5b73e8 100%);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    max-width: 350px;
    animation: slideIn 0.3s ease-out;
  `;
  
  successNotif.textContent = message;
  document.body.appendChild(successNotif);
  
  setTimeout(() => {
    successNotif.style.opacity = '0';
    setTimeout(() => successNotif.remove(), 300);
  }, 4000);
}