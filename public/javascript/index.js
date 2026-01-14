const members = [
    {
        name: "Prabhsamarth Singh",
        role: "Founder",
        image: "public/images/prabhsamarth.png",
        bio: "Visionary leader driving Novaa Speed's mission to empower teen entrepreneurs.",
        linkedin: "https://www.linkedin.com/in/prabhsamarth-singh-946b621ba/"
    },
    {
        name: "Divyanshu Tiwari",
        role: "Co-Founder",
        image: "public/images/divanshu.png",
        bio: "Strategic thinker focused on building sustainable community growth.",
        linkedin: "https://www.linkedin.com/in/its-tiwari/"
    },
    {
        name: "Pranay",
        role: "PR HEAD",
        image: "public/images/pranay.png",
        bio: "Expert in public relations and community outreach strategies.",
        linkedin: "https://www.linkedin.com/in/spidenton"
    },
    {
        name: "Shaurya Gadhyan",
        role: "Developers head",
        image: "public/images/shaurya2.png",
        bio: "Leading the technical development and innovation at Novaa Speed.",
        linkedin: "https://www.linkedin.com/in/shaurya-gadhyan-978ba5232/"
    },
    {
        name: "Shaurya Prabhakar",
        role: "Developer/Website Manager",
        image: "public/images/shaurya.png",
        bio: "Full-stack developer responsible for maintaining and optimizing the web platform.",
        linkedin: "https://gemini.google.com/app/a51609527dd17ef7"
    },
    {
        name: "Rudra Pratap Singh",
        role: "Website Manager",
        image: "public/images/rudra.png",
        bio: "Ensuring smooth website operations and user experience.",
        linkedin: "https://www.linkedin.com/in/rudra-pratap-singh-5a96721ba/"
    },
    {
        name: "Kaushik",
        role: "Manager",
        image: "public/images/kaushik.png",
        bio: "Managing day-to-day operations and team coordination.",
        linkedin: "https://www.linkedin.com/in/kaushik-s-8b96721ba/"
    },
    {
        name: "Vaishnav",
        role: "Assistant manager",
        image: "public/images/vaishnav.png",
        bio: "Vaishnav Pandey (the Assistant Manager) at NovaaSpeed, supporting daily operations and team coordination. He helps maintain service quality, manages customer needs, and assists management in achieving company goals.",
        linkedin: "https://www.linkedin.com/in/vaishnav-pandey-8b96721ba/"
    },
];

const steps = Array.from(document.querySelectorAll('.form-step'));
const nextBtns = document.querySelectorAll('.next-btn');
const prevBtns = document.querySelectorAll('.prev-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-percentage');

const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const overlay = document.getElementById('mobileNavOverlay');
const closeNav = document.getElementById('closeNav');
const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

const modal = document.getElementById('memberModal');
const modalImg = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalRole = document.getElementById('modalRole');
const modalBio = document.getElementById('modalBio');
const closeModalBtn = document.getElementById('closeModal');
const linkdinBtn = document.getElementById('linkdin');

function generatePattern(seed) {
    const colors = ["#8a2be2", "#00fff2", "#fff"];
    const c = colors[seed % 3];
    return `<svg viewBox="0 0 100 100" style="background:#111">
        <circle cx="50" cy="50" r="${20 + seed * 2}" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M0,${seed * 10} L100,${100 - seed * 10}" stroke="rgba(255,255,255,0.3)" />
    </svg>`;
}

function createMemberCard(member) {
    const card = document.createElement('div');
    card.className = 'member-card';
    card.style.cursor = 'pointer';
    card.onclick = () => openMemberModal(member);

    card.innerHTML = `
        <div class="member-avatar" style="width: 50px; height: 50px; overflow: hidden; border-radius: 50%;">
            <img src="${member.image}" alt="${member.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="member-info">
            <div class="member-name">${member.name}</div>
            <div class="member-role">${member.role}</div>
        </div>
    `;
    return card;
}

function createSliderRows() {
    const container = document.getElementById('sliderContainer');

    for (let row = 0; row < 2; row++) {
        const sliderRow = document.createElement('div');
        sliderRow.className = 'slider-row';

        const speed = 45 + (row * 5);
        sliderRow.style.setProperty('--speed', `${speed}s`);

        for (let i = 0; i < 6; i++) {
            members.forEach(member => sliderRow.appendChild(createMemberCard(member)));
        }
        container.appendChild(sliderRow);
    }
}
createSliderRows();

function openMemberModal(member) {
    if (!modal) return;

    modalImg.src = member.image;
    modalName.textContent = member.name;
    modalRole.textContent = member.role;
    modalBio.textContent = member.bio || "No bio available.";

    if (linkdinBtn) {
        linkdinBtn.href = member.linkedin;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMemberModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

if (closeModalBtn) closeModalBtn.addEventListener('click', closeMemberModal);

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeMemberModal();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeMemberModal();
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-section').forEach(section => observer.observe(section));

let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animateOrbs() {
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    const orb1 = document.querySelector('.glow-orb-1');
    const orb2 = document.querySelector('.glow-orb-2');

    if (orb1) orb1.style.transform = `translate(${currentX * 50}px, ${currentY * 50}px)`;
    if (orb2) orb2.style.transform = `translate(${-currentX * 50}px, ${-currentY * 50}px)`;

    requestAnimationFrame(animateOrbs);
}
animateOrbs();

document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

let currentStep = 0;

function updateForm() {
    steps.forEach((step, index) => {
        step.classList.remove('active');
        if (index === currentStep) {
            step.classList.add('active');
        }
    });

    if (progressBar && progressText) {
        const progress = ((currentStep + 1) / steps.length) * 100;
        progressBar.style.width = progress + '%';
        progressText.innerText = Math.round(progress) + '%';
    }
}

nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const currentInputs = steps[currentStep].querySelectorAll('input[required], select[required]');
        let isValid = true;
        currentInputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.style.borderBottomColor = 'red';
            } else {
                input.style.borderBottomColor = 'var(--accent-cyan)';
            }
        });

        if (isValid && currentStep < steps.length - 1) {
            currentStep++;
            updateForm();
        }
    });
});

prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateForm();
        }
    });
});

function toggleMenu() {
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMenu);
closeNav.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

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
    handleSwipe();
}, false);

function handleSwipe() {
    const edgeThreshold = 30;
    const swipeDistance = 50;

    if (touchEndX > touchStartX + swipeDistance) {
        if (!mobileNav.classList.contains('active') && touchStartX < edgeThreshold) {
            toggleMenu();
        }
    }
    if (touchEndX < touchStartX - swipeDistance) {
        if (mobileNav.classList.contains('active')) {
            toggleMenu();
        }
    }
}

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