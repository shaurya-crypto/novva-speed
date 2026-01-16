document.addEventListener('DOMContentLoaded', () => {
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const resetBtn = document.getElementById('resetBtn');
    const stepOtp = document.getElementById('step-otp');
    const emailInput = document.getElementById('emailInput');
    const form = document.getElementById('forgetForm');
    const statusMsg = document.getElementById('statusMsg');

    function showMessage(text, type = 'error') {
        if (statusMsg) {
            statusMsg.textContent = text;
            statusMsg.className = `status-message visible ${type}`;
            if (type === 'error') setTimeout(() => statusMsg.classList.remove('visible'), 5000);
        } else {
            alert(text);
        }
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
        if (statusMsg) statusMsg.classList.remove('visible');

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
            showMessage("Connection error. Check console.", "error");
            sendOtpBtn.innerHTML = originalText;
            sendOtpBtn.disabled = false;
        }
    }

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
            console.error(err);
            showMessage("Update failed.", "error");
            resetBtn.innerHTML = originalText;
            resetBtn.disabled = false;
        }
    }


    if (sendOtpBtn) {
        sendOtpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleSendOtp();
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const isOtpVisible = window.getComputedStyle(stepOtp).display !== 'none';

            if (!isOtpVisible) {
                await handleSendOtp();
            } else {
                await handleResetPassword();
            }
        });
    }
});