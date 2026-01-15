const sendOtpBtn = document.getElementById('sendOtpBtn');
const resetBtn = document.querySelector('button[type="submit"]');
const stepOtp = document.getElementById('step-otp');
const emailInput = document.getElementById('emailInput');
const form = document.getElementById('forgetForm');
const statusMsg = document.createElement('div');
statusMsg.className = 'status-message';
form.insertBefore(statusMsg, form.firstChild);

function showMessage(text, type = 'error') {
    statusMsg.textContent = text;
    statusMsg.className = `status-message visible ${type}`;
    if (type === 'error') setTimeout(() => statusMsg.classList.remove('visible'), 8000);
}

async function handleSendOtp() {
    const email = emailInput.value.trim();
    if (!email || !email.includes('@')) {
        showMessage("Please enter a valid email address.", "error");
        emailInput.focus();
        return;
    }

    const originalText = sendOtpBtn.innerHTML;
    sendOtpBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';
    sendOtpBtn.disabled = true;
    statusMsg.classList.remove('visible');

    try {
        const res = await fetch('/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });
        const data = await res.json();

        if (data.success) {
            showMessage("Verification code sent to your email.", "success");
            emailInput.classList.add('locked');
            emailInput.setAttribute('readonly', true);
            sendOtpBtn.style.display = 'none';
            stepOtp.style.display = 'block';

            setTimeout(() => document.getElementById('otpInput').focus(), 500);
        } else {
            showMessage(data.message || "Failed to send code.", "error");
            sendOtpBtn.innerHTML = originalText;
            sendOtpBtn.disabled = false;
        }
    } catch (err) {
        console.error(err);
        showMessage("Connection error.", "error");
        sendOtpBtn.innerHTML = originalText;
        sendOtpBtn.disabled = false;
    }
}

sendOtpBtn.addEventListener('click', handleSendOtp);

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isOtpStepHidden = window.getComputedStyle(stepOtp).display === 'none';

    if (isOtpStepHidden) {
        handleSendOtp();
    } else {
        await handleResetPassword();
    }
});

async function handleResetPassword() {
    const email = emailInput.value;
    const otp = document.getElementById('otpInput').value.trim();
    const newPassword = document.getElementById('newPassInput').value;
    const confirmPassword = document.getElementById('confirmPassInput').value;

    if (otp.length < 6) return showMessage("Enter the complete 6-digit OTP.", "error");
    if (newPassword.length < 6) return showMessage("Password must be 6+ chars.", "error");
    if (newPassword !== confirmPassword) return showMessage("Passwords do not match.", "error");

    const originalText = resetBtn.innerHTML;
    resetBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Updating...';
    resetBtn.disabled = true;

    try {
        const res = await fetch('/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, newPassword })
        });
        const data = await res.json();

        if (data.success) {
            showMessage("Success! Redirecting...", "success");
            setTimeout(() => window.location.href = '/login', 2000);
        } else {
            showMessage(data.message || "Invalid OTP.", "error");
            resetBtn.innerHTML = originalText;
            resetBtn.disabled = false;
        }
    } catch (err) {
        showMessage("Update failed.", "error");
        resetBtn.innerHTML = originalText;
        resetBtn.disabled = false;
    }
}