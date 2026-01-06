
// const members = [
//     { name: "Shaurya Gadhyan", role: "Editor, Developer", pattern: 1 },
//     { name: "Divyanshu Tiwari", role: "Developer", pattern: 2 },
//     { name: "Rudra Pratap Singh", role: "Editor", pattern: 3 },
//     { name: "Aditya Raj", role: "Member", pattern: 4 },
//     { name: "Saksham Singh", role: "Member", pattern: 5 },
//     { name: "Farhan", role: "Member", pattern: 6 },
//     { name: "Atharv Verma", role: "Member", pattern: 7 },
//     { name: "Pallav Preet", role: "Member", pattern: 8 },
//     { name: "Akhilesh Yadav", role: "Member", pattern: 9 },
//     { name: "Abheejit CID", role: "Member", pattern: 10 }
// ];

// function generatePattern(seed) {
//     const patterns = [
//         `<svg viewBox="0 0 100 100">
//         <rect fill="#1a1a1a"/>
//         <circle cx="25" cy="25" r="20" fill="none" stroke="#444" stroke-width="2"/>
//         <circle cx="75" cy="75" r="20" fill="none" stroke="#666" stroke-width="2"/>
//         <line x1="25" y1="25" x2="75" y2="75" stroke="#333" stroke-width="1"/>
//         </svg>`,
        
//         `<svg viewBox="0 0 100 100">
//         <rect fill="#1a1a1a"/>
//         <path d="M0,50 L50,0 L100,50 L50,100 Z" fill="none" stroke="#555" stroke-width="2"/>
//         <circle cx="50" cy="50" r="15" fill="none" stroke="#777" stroke-width="2"/>
//         </svg>`,
        
//         `<svg viewBox="0 0 100 100"><rect fill="#1a1a1a"/>
//         <line x1="0" y1="0" x2="100" y2="100" stroke="#444" stroke-width="1"/>
//         <line x1="100" y1="0" x2="0" y2="100" stroke="#666" stroke-width="1"/>
//         <circle cx="50" cy="50" r="25" fill="none" stroke="#555" stroke-width="2"/>
//         </svg>`,
        
//         `<svg viewBox="0 0 100 100"><rect fill="#1a1a1a"/>
//         <rect x="20" y="20" width="60" height="60" fill="none" stroke="#555" stroke-width="2"/>
//         <rect x="35" y="35" width="30" height="30" fill="none" stroke="#777" stroke-width="2"/>
//         </svg>`,
        
//         `<svg viewBox="0 0 100 100"><rect fill="#1a1a1a"/>
//         <polygon points="50,10 90,90 10,90" fill="none" stroke="#555" stroke-width="2"/>
//         <circle cx="50" cy="60" r="20" fill="none" stroke="#666" stroke-width="2"/>
//         </svg>`,
        
//         `<svg viewBox="0 0 100 100"><rect fill="#1a1a1a"/>
//         <path d="M20,50 Q35,20 50,50 T80,50" fill="none" stroke="#555" stroke-width="2"/>
//         <circle cx="20" cy="50" r="5" fill="#666"/>
//         <circle cx="50" cy="50" r="5" fill="#666"/>
//         <circle cx="80" cy="50" r="5" fill="#666"/>
//         </svg>`,
        
//         `<svg viewBox="0 0 100 100"><rect fill="#1a1a1a"/>
//         <circle cx="30" cy="30" r="15" fill="none" stroke="#555" stroke-width="2"/>
//         <circle cx="70" cy="30" r="15" fill="none" stroke="#666" stroke-width="2"/>
//         <circle cx="50" cy="70" r="15" fill="none" stroke="#777" stroke-width="2"/>
//         </svg>`,
        
//         `<svg viewBox="0 0 100 100"><rect fill="#1a1a1a"/>
//         <rect x="10" y="10" width="35" height="35" fill="none" stroke="#555" stroke-width="2"/>
//         <rect x="55" y="55" width="35" height="35" fill="none" stroke="#666" stroke-width="2"/>
//         <line x1="45" y1="10" x2="55" y2="90" stroke="#444" stroke-width="1"/>
//         </svg>`,
        
//         `<svg viewBox="0 0 100 100"><rect fill="#1a1a1a"/>
//         <polygon points="50,20 80,80 20,80" fill="none" stroke="#555" stroke-width="2"/>
//         <polygon points="50,35 70,70 30,70" fill="none" stroke="#666" stroke-width="2"/>
//         </svg>`,
        
//         `<svg viewBox="0 0 100 100"><rect fill="#1a1a1a"/><circle cx="50" cy="50" r="35" fill="none" stroke="#444" stroke-width="1"/>
//         <circle cx="50" cy="50" r="25" fill="none" stroke="#555" stroke-width="2"/>
//         <circle cx="50" cy="50" r="15" fill="none" stroke="#666" stroke-width="2"/>
//         </svg>`
//     ];

    
//     return patterns[seed - 1] || patterns[0];
// }


// function createMemberCard(member) {
//     const card = document.createElement('div');
//     card.className = 'member-card';
    
//     card.innerHTML = `
//         <div class="member-avatar">
//             ${generatePattern(member.pattern)}
//         </div>
//         <div class="member-info">
//             <div class="member-name">${member.name}</div>
//             <div class="member-role">${member.role}</div>
//         </div>
//     `;
    
//     return card;
// }


// function createSliderRows() {
//     const container = document.getElementById('sliderContainer');
//     const membersPerRow = Math.ceil(members.length / 3);
    
//     for (let row = 0; row < 3; row++) {
//         const sliderRow = document.createElement('div');
//         sliderRow.className = 'slider-row';
        
//         // Duplicate members to create infinite scroll effect
//         const rowMembers = members.slice(row * membersPerRow, (row + 1) * membersPerRow);
        
//         // Create multiple copies for seamless loop
//         for (let i = 0; i < 8; i++) {
//             rowMembers.forEach(member => {
//                 sliderRow.appendChild(createMemberCard(member));
//             });
//         }
        
//         container.appendChild(sliderRow);
//     }
// }


// createSliderRows();


// document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//     anchor.addEventListener('click', function (e) {
//         e.preventDefault();
//         const target = document.querySelector(this.getAttribute('href'));
//         if (target) {
//             target.scrollIntoView({
//                 behavior: 'smooth',
//                 block: 'start'
//             });
//         }
//     });
// });


// const observerOptions = {
//     threshold: 0.15,
//     rootMargin: '0px 0px -80px 0px'
// };

// const observer = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//         if (entry.isIntersecting) {
//             entry.target.classList.add('visible');
//         }
//     });
// }, observerOptions);

// document.querySelectorAll('.fade-in-section').forEach(section => {
//     observer.observe(section);
// });

// //paralax effect for glowing orbs
// let mouseX = 0;
// let mouseY = 0;
// let currentX = 0;
// let currentY = 0;

// document.addEventListener('mousemove', (e) => {
//     mouseX = e.clientX / window.innerWidth;
//     mouseY = e.clientY / window.innerHeight;
// });

// function animateOrbs() {
//     currentX += (mouseX - currentX) * 0.05;
//     currentY += (mouseY - currentY) * 0.05;
    
//     const orb1 = document.querySelector('.glow-orb-1');
//     const orb2 = document.querySelector('.glow-orb-2');
    
//     if (orb1) {
//         orb1.style.transform = `translate(${currentX * 40}px, ${currentY * 40}px)`;
//     }
//     if (orb2) {
//         orb2.style.transform = `translate(${-currentX * 30}px, ${-currentY * 30}px)`;
//     }
    
//     requestAnimationFrame(animateOrbs);
// }

// animateOrbs();

// //new event for scrling
// window.addEventListener('scroll', () => {
//     const sections = document.querySelectorAll('section[id]');
//     const scrollPos = window.scrollY + 100;
    
//     sections.forEach(section => {
//         const sectionTop = section.offsetTop;
//         const sectionHeight = section.offsetHeight;
//         const sectionId = section.getAttribute('id');
        
//         if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
//             document.querySelectorAll('.nav-links a').forEach(link => {
//                 link.classList.remove('active');
//                 if (link.getAttribute('href') === `#${sectionId}`) {
//                     link.classList.add('active');
//                 }
//             });
//         }
//     });

// });
// --- Member Data & Pattern Generator (Kept Original Logic) ---
const members = [
    { name: "", role: "", pattern: 1 },
    { name: "", role: "", pattern: 2 },
    { name: "", role: "", pattern: 3 },
    { name: "", role: "", pattern: 4 },
    { name: "", role: "", pattern: 5 },
    { name: "", role: "", pattern: 6 },
    { name: "", role: "", pattern: 7 },
    { name: "", role: "", pattern: 8 },
    { name: "", role: "", pattern: 9 },
    { name: "", role: "", pattern: 10 }
];

function generatePattern(seed) {
    // Simplified SVG patterns for brevity - using the ones you provided
    const colors = ["#8a2be2", "#00fff2", "#fff" ]; 
    const c = colors[seed % 3];
    return `<svg viewBox="0 0 100 100" style="background:#111">
        <circle cx="50" cy="50" r="${20 + seed * 2}" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M0,${seed*10} L100,${100-seed*10}" stroke="rgba(255,255,255,0.3)" />
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
    for (let row = 0; row < 2; row++) {
        const sliderRow = document.createElement('div');
        sliderRow.className = 'slider-row';
        // Set specific speeds
        sliderRow.style.setProperty('--speed', row === 0 ? '35s' : '45s');
        
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
        
        // Calculate rotation based on cursor position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

function btn_working() {
    const communityBtn = document.getElementById('community');

    communityBtn.addEventListener('click', () => {
        window.location.href = "https://chat.whatsapp.com/BBIbMzhyhuQ2rn1vMkqjkq";
    });
}
btn_working()