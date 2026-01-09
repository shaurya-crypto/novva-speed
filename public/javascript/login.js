
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputs = document.querySelectorAll('input');
    const errorDiv = document.getElementById('errorMsg');

    inputs.forEach(i => i.classList.remove('shake'));
    errorDiv.textContent = '';

    const formData = Object.fromEntries(new FormData(e.target));

    try {
        const res = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (data.success) {
            window.location.href = data.redirect;
        } else {
            errorDiv.textContent = data.message;
            inputs.forEach(i => i.classList.add('shake'));
            setTimeout(() => {
                inputs.forEach(i => i.classList.remove('shake'));
            }, 400);
        }
    } catch (err) {
        errorDiv.textContent = "Server Connection Failed";
    }
});


document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch('/auth/check-status');
        const data = await res.json();

        const navSignup = document.getElementById('nav-signup');
        const navProfile = document.getElementById('nav-profile');
        const mobileSignup = document.getElementById('mobile-signup');
        const mobileProfile = document.getElementById('mobile-profile');

        if (data.loggedIn) {
            if (navSignup) navSignup.style.display = 'none';
            if (navProfile) navProfile.style.display = 'block';

            if (mobileSignup) mobileSignup.style.display = 'none';
            if (mobileProfile) mobileProfile.style.display = 'block';
        } else {
            if (navSignup) navSignup.style.display = 'block';
            if (navProfile) navProfile.style.display = 'none';

            if (mobileSignup) mobileSignup.style.display = 'block';
            if (mobileProfile) mobileProfile.style.display = 'none';
        }
    } catch (err) {
        console.error("Auth check failed:", err);
    }
});