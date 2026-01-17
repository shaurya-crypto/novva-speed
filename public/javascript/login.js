
// Single DOMContentLoaded listener to avoid duplicates
document.addEventListener('DOMContentLoaded', async () => {
    initMobileNav();
    await checkAuthStatus();
    
    // Setup login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(e) {
    e.preventDefault();

    const inputs = document.querySelectorAll('input');
    const errorDiv = document.getElementById('errorMsg');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    inputs.forEach(i => i.classList.remove('shake'));
    if (errorDiv) errorDiv.textContent = '';

    const formData = Object.fromEntries(new FormData(e.target));

    // Show loading state
    if (submitBtn) {
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
    }

    try {
        const res = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (data.success) {
            window.location.href = data.redirect || '/dashboard';
        } else {
            if (errorDiv) {
                errorDiv.textContent = data.message || 'Login failed. Please try again.';
            }
            inputs.forEach(i => i.classList.add('shake'));
            setTimeout(() => {
                inputs.forEach(i => i.classList.remove('shake'));
            }, 400);
        }
    } catch (err) {
        console.error('Login error:', err);
        if (errorDiv) {
            errorDiv.textContent = "Connection failed. Please check your internet and try again.";
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.textContent.replace('Logging in...', 'Login');
        }
    }
}

// --- 1. Mobile Navigation Logic ---
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const overlay = document.getElementById('mobileNavOverlay');
    const closeNav = document.getElementById('closeNav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    function toggleMenu() {
        if (!mobileNav || !overlay) return;

        mobileNav.classList.toggle('active');
        overlay.classList.toggle('active');

        // Prevent background scrolling when menu is open
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    }

    if (hamburger) hamburger.addEventListener('click', toggleMenu);
    if (closeNav) closeNav.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    // Close menu when any link inside is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // --- Touch Gestures (Swipe to Open/Close) ---
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;

        // Swipe Left to Close (if menu is open)
        if (touchEndX < touchStartX - 50 && mobileNav.classList.contains('active')) {
            toggleMenu();
        }

        // Swipe Right to Open (from edge, if menu is closed)
        if (touchEndX > touchStartX + 50 && touchStartX < 30 && !mobileNav.classList.contains('active')) {
            toggleMenu();
        }
    }, false);
}

// --- 2. Auth Status Check (Toggle Sign Up / Profile) ---
async function checkAuthStatus() {
    try {
        const res = await fetch('/auth/check-status');
        const data = await res.json();

        // Desktop Elements
        const navSignup = document.getElementById('nav-signup');
        const navProfile = document.getElementById('nav-profile');

        // Mobile Elements
        const mobileSignup = document.getElementById('mobile-signup');
        const mobileProfile = document.getElementById('mobile-profile');

        if (data.loggedIn) {
            // Logged In: Show Profile
            if (navSignup) navSignup.style.display = 'none';
            if (navProfile) navProfile.style.display = 'block';

            if (mobileSignup) mobileSignup.style.display = 'none';
            if (mobileProfile) mobileProfile.style.display = 'block';
        } else {
            // Not Logged In: Show Sign Up
            if (navSignup) navSignup.style.display = 'block';
            if (navProfile) navProfile.style.display = 'none';

            if (mobileSignup) mobileSignup.style.display = 'block';
            if (mobileProfile) mobileProfile.style.display = 'none';
        }
    } catch (err) {
        console.error("Auth check failed:", err);
    }
}