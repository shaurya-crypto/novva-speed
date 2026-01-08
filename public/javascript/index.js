const members = [
    { name: "Prabhsamarth Singh", role: "Founder", image: "public/images/prabhsamarth.jpg" },
    { name: "Divyanshu Tiwari", role: "Co-Founder", image: "public/images/divanshu.png" },
    { name: "Pranay", role: "PR HEAD", image: "public/images/pranay.jpg" },
    { name: "Shaurya Gadhyan", role: "Developers head", image: "public/images/shaurya2.png" },
    { name: "Shaurya Prabhakar", role: "Developer/Website Manager", image: "public/images/shaurya.png" },
    { name: "Rudra Pratap Singh", role: "Website Manager", image: "public/images/rudra.png" },
    { name: "Kaushik", role: "Manager", image: "public/images/kaushik.jpg" },
    { name: "Vaishnav", role: "Assistant manager", image: "public/images/vaishnav.jpg" },
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

// function createSliderRows() {
//     const container = document.getElementById('sliderContainer');
//     const membersPerRow = Math.ceil(members.length / 3);

//     for (let row = 0; row < 3; row++) {
//         const sliderRow = document.createElement('div');
//         sliderRow.className = 'slider-row';

//         sliderRow.style.setProperty('--speed', row === 0 ? '49s' : '55s');


//         for (let i = 0; i < 6; i++) {
//             members.forEach(member => sliderRow.appendChild(createMemberCard(member)));
//         }
//         container.appendChild(sliderRow);
//     }
// }
function createSliderRows() {
    const container = document.getElementById('sliderContainer');

    for (let row = 0; row < 3; row++) {
        const sliderRow = document.createElement('div');
        sliderRow.className = 'slider-row';

        const speed = 30 + (row * 5);
        sliderRow.style.setProperty('--speed', `${speed}s`);

        for (let i = 0; i < 6; i++) {
            members.forEach(member => sliderRow.appendChild(createMemberCard(member)));
        }
        container.appendChild(sliderRow);
    }
}
createSliderRows();

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


//form change karne ke liye
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
    if (touchEndX > touchStartX + 50) {
        if (!mobileNav.classList.contains('active')) toggleMenu();
    }
    if (touchEndX < touchStartX - 50) {
        if (mobileNav.classList.contains('active')) toggleMenu();
    }
}