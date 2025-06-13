// API base URL
const API_BASE = window.location.origin;

// DOM elements
const verificationForm = document.getElementById('verificationForm');
const loadingDiv = document.getElementById('loading');
const resultDiv = document.getElementById('result');

// Initialize form handler
if (verificationForm) {
    verificationForm.addEventListener('submit', handleFormSubmit);
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const startDate = formData.get('startDate');
    
    await verifyCertificate(name, startDate);
}

// Verify certificate function
async function verifyCertificate(name, startDate) {
    showLoading();
    hideResult();
    
    try {
        const response = await fetch(`${API_BASE}/api/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, startDate })
        });
        
        const data = await response.json();
        
        hideLoading();
        
        if (data.success) {
            displaySuccess(data.certificate);
        } else {
            displayError(data.message || 'Certificate not found');
        }
    } catch (error) {
        hideLoading();
        displayError('Network error. Please try again.');
        console.error('Verification error:', error);
    }
}

// Verify certificate from URL parameters
async function verifyCertificateFromURL(name, startDate) {
    const loadingDiv = document.getElementById('loading');
    const certificateDiv = document.getElementById('certificate');
    const errorDiv = document.getElementById('error');
    
    try {
        const response = await fetch(`${API_BASE}/api/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, startDate })
        });
        
        const data = await response.json();
        
        loadingDiv.classList.add('hidden');
        
        if (data.success) {
            displayCertificate(data.certificate);
            certificateDiv.classList.remove('hidden');
        } else {
            errorDiv.classList.remove('hidden');
        }
    } catch (error) {
        loadingDiv.classList.add('hidden');
        errorDiv.classList.remove('hidden');
        console.error('Verification error:', error);
    }
}

// Display functions
function showLoading() {
    if (loadingDiv) loadingDiv.classList.remove('hidden');
}

function hideLoading() {
    if (loadingDiv) loadingDiv.classList.add('hidden');
}

function hideResult() {
    if (resultDiv) resultDiv.classList.add('hidden');
}

function displaySuccess(certificate) {
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="success">
                <h3>✅ Certificate Verified!</h3>
                <p><strong>Name:</strong> ${certificate.name}</p>
                <p><strong>Duration:</strong> ${certificate.duration}</p>
                <p><strong>Certificate ID:</strong> ${certificate.CIN}</p>
                <div class="verification-link">
                    <p><strong>Shareable Link:</strong></p>
                    <input type="text" readonly value="${generateVerificationLink(certificate.name, certificate.startDate)}" onclick="this.select()">
                    <button onclick="copyToClipboard('${generateVerificationLink(certificate.name, certificate.startDate)}')">Copy</button>
                </div>
            </div>
        `;
        resultDiv.classList.remove('hidden');
    }
}

function displayError(message) {
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="error">
                <h3>❌ Verification Failed</h3>
                <p>${message}</p>
            </div>
        `;
        resultDiv.classList.remove('hidden');
    }
}

function displayCertificate(certificate) {
    const certificateDiv = document.getElementById('certificate');
    const currentDate = new Date().toLocaleDateString();
    
    // Set date to current date plus 7 days
    const verificationDate = new Date();
    verificationDate.setDate(verificationDate.getDate() + 7);
    const formattedVerificationDate = verificationDate.toLocaleDateString();

    certificateDiv.innerHTML = `
        <div class="certificate-content">
            <div class="certificate-header">
                <img src="assets/logo.png" alt="S3CloudHub Logo" class="certificate-logo" onerror="this.style.display='none'">
                <h1 class="company-name">S3CloudHub</h1>
            </div>
            
            <div class="certificate-body">
                <h2 class="certificate-title">Certificate of Completion</h2>
                <p class="certificate-subtitle">This is to certify that</p>
                
                <h3 class="intern-name">${certificate.name}</h3>
                
                <p class="certificate-text">
                    has successfully completed an internship program at S3CloudHub
                </p>
                
                <div class="certificate-details">
                    <div class="detail-row">
                        <span class="detail-label">Start Date:</span>
                        <span class="detail-value">${formatDate(certificate.startDate)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">End Date:</span>
                        <span class="detail-value">${formatDate(certificate.endDate)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Duration:</span>
                        <span class="detail-value">${certificate.duration}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Certificate ID:</span>
                        <span class="detail-value">${certificate.CIN}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Internship Track:</span>
                        <span class="detail-value">${certificate.internshipTrack}</span>
                    </div>
                </div>
            </div>
            
            <div class="certificate-footer">
                <div class="verification-stamp">
                    <p class="verified-text">✅ Verified by S3CloudHub</p>
                    <p class="verification-date">Verified on: ${certificate.verifiedDate}</p>
                </div>
            </div>
        </div>
    `;
}

// Utility functions
function generateVerificationLink(name, startDate) {
    const encodedName = encodeURIComponent(name);
    return `${window.location.origin}/verify.html?name=${encodedName}&from=${startDate}`;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Link copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Link copied to clipboard!');
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}