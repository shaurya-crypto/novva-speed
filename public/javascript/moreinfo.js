
document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    checkAuthStatus();
    initAnimations();
});

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

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // Optional: Mobile Swipe to Close
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX, false);
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        // If swiped left significantly
        if (touchEndX < touchStartX - 50 && mobileNav.classList.contains('active')) {
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

// --- 3. Page Animations (Scroll & Tilt) ---
function initAnimations() {
    // Scroll Fade In
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-section').forEach(section => observer.observe(section));

    // Tilt Effect
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Subtle tilt calculation
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}