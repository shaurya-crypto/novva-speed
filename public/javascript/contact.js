const form = document.getElementById('contactForm');
const btn = document.getElementById('sendBtn');
const statusMsg = document.getElementById('statusMsg');

function showStatus(text, type) {
    statusMsg.textContent = text;
    statusMsg.className = `status-msg ${type}`;
    statusMsg.style.display = 'block';
    setTimeout(() => statusMsg.style.display = 'none', 5000);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner"></i> Sending...';
    btn.disabled = true;

    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    try {
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();

        if (result.success) {
            showStatus("Message transmitted successfully!", "success");
            form.reset();
        } else {
            showStatus("Transmission failed. Try again.", "error");
        }
    } catch (error) {
        showStatus("Connection Error.", "error");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
});

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

        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    }

    if (hamburger) hamburger.addEventListener('click', toggleMenu);
    if (closeNav) closeNav.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;

        if (touchEndX < touchStartX - 50 && mobileNav.classList.contains('active')) {
            toggleMenu();
        }

        if (touchEndX > touchStartX + 50 && touchStartX < 30 && !mobileNav.classList.contains('active')) {
            toggleMenu();
        }
    }, false);
}

initMobileNav()