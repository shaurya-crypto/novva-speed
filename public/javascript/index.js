const members = [
    { name: "Prabhsamarth Singh", role: "Founder", pattern: 1 },
    { name: "Divyanshu Tiwari", role: "Co-Founder", pattern: 2 },
    { name: "Pranay", role: "PR HEAD", pattern: 3 },
    { name: "Shaurya Gadhyan", role: "Developers head", pattern: 4 },
    { name: "Shaurya Prabhakar", role: "Developer/Website Manager", pattern: 5 },
    { name: "Rudra Pratap Singh", role: "Website Manager", pattern: 6 },
    { name: "Kaushik", role: "Manager", pattern: 7 },
    { name: "Vaishnav", role: "Assistant manager", pattern: 8 },
    // { name: "", role: "", pattern: 9 },
    // { name: "", role: "", pattern: 10 }
];

function generatePattern(seed) {
    // Simplified SVG patterns for brevity - using the ones you provided
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
    card.innerHTML = `
        <div class="member-avatar">${generatePattern(member.pattern)}</div>
        <div class="member-info">
            <div class="member-name">${member.name}</div>
            <div class="member-role">${member.role}</div>
        </div>
    `;
    return card;
}

function createSliderRows() {
    const container = document.getElementById('sliderContainer');
    const membersPerRow = Math.ceil(members.length / 2); // Split into 2 rows logic

    // Create 2 rows
    for (let row = 0; row < 3; row++) {
        const sliderRow = document.createElement('div');
        sliderRow.className = 'slider-row';
        // Set specific speeds
        sliderRow.style.setProperty('--speed', row === 0 ? '45s' : '55s');

        // Loop members to fill width
        for (let i = 0; i < 6; i++) {
            members.forEach(member => sliderRow.appendChild(createMemberCard(member)));
        }
        container.appendChild(sliderRow);
    }
}
createSliderRows();

// --- Smooth Scroll ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// --- Scroll Observer (Fade In) ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-section').forEach(section => observer.observe(section));

// --- Mouse Parallax for Orbs ---
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

// --- 3D TILT EFFECT (New Feature) ---
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

btn_working()


const steps = Array.from(document.querySelectorAll('.form-step'));
const nextBtns = document.querySelectorAll('.next-btn');
const prevBtns = document.querySelectorAll('.prev-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-percentage');

let currentStep = 0;

function updateForm() {
    steps.forEach((step, index) => {
        step.classList.remove('active');
        if (index === currentStep) {
            step.classList.add('active');
        }
    });

    const progress = ((currentStep + 1) / steps.length) * 100;
    progressBar.style.width = progress + '%';
    progressText.innerText = Math.round(progress) + '%';
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

updateForm();