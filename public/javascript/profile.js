// document.addEventListener('DOMContentLoaded', loadProfile);

// let currentUser = {};

// async function loadProfile() {
//     try {
//         const res = await fetch('/api/user/profile');
//         if (res.status === 401) return window.location.href = '/login';

//         const data = await res.json();
//         const user = data.user;
//         currentUser = user;

//         const profileImg = document.getElementById('profilePic');
//         if (user.profilePic) {
//             profileImg.src = user.profilePic;
//         } else {
//             profileImg.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
//         }

//         document.getElementById('fullName').textContent = user.username || 'User';
//         document.getElementById('username').textContent = user.username || 'user';
//         document.getElementById('bio').textContent = user.bio || 'No bio available';
//         document.getElementById('email').textContent = user.email;
//         document.getElementById('joinedDate').textContent = new Date(user.createdAt).toLocaleDateString();

//         document.getElementById('editName').value = user.username;
//         document.getElementById('editBio').value = user.bio;

//         if (data.hasSubmitted) {
//             const app = data.applicationData;
//             const statusBadge = document.getElementById('formStatusBadge');
//             const cta = document.getElementById('formCTA');
//             const details = document.getElementById('formDetails');
//             const idCard = document.getElementById('idCardContainer');
//             const msgBox = document.getElementById('cardUpdateBox');

//             // Reset display
//             cta.style.display = 'none';
//             details.style.display = 'none';
//             idCard.style.display = 'none';
//             msgBox.style.display = 'none';

//             // --- 1. SHOW ADMIN MESSAGE (Always, if exists) ---
//             if (app.adminMessage) {
//                 msgBox.style.display = 'block';
//                 document.getElementById('cardUpdateMsg').textContent = app.adminMessage;
//             }

//             // --- 2. CHECK STATUS ---
//             if (app.status === 'blocked') {
//                 statusBadge.textContent = 'BLOCKED';
//                 statusBadge.className = 'badge badge-danger';

//                 cta.innerHTML = `<p style="color: #ff3333; font-weight: bold;"><i class="fas fa-ban"></i> You are temporarily blocked by admin. Please contact support.</p>`;
//                 cta.style.display = 'block';
//                 // Stop here, don't show other details if blocked
//                 return;
//             }

//             if (app.status === 'rejected') {
//                 statusBadge.textContent = 'REJECTED';
//                 statusBadge.className = 'badge badge-danger';

//                 cta.innerHTML = `
//                     <p style="color: orange; font-weight: bold; margin-bottom: 10px;">
//                         <i class="fas fa-exclamation-circle"></i> Application rejected! Try later.
//                     </p>
//                     <a href="/auth/joinus" class="cta-button primary" style="background: orange; color: #000; font-weight: 700;">
//                         <i class="fas fa-redo"></i> Refill Application
//                     </a>
//                 `;
//                 cta.style.display = 'block';
//                 // Return to prevent showing ID card logic, but Admin Msg still shows above due to step 1
//                 return;
//             }

//             // --- 3. APPROVED STATUS (Show ID Card) ---
//             if (['checked', 'approved', 'reviewed'].includes(app.status)) {
//                 statusBadge.textContent = 'APPROVED';
//                 statusBadge.className = 'badge badge-success';

//                 // Show ID Card if specific data exists
//                 if (app.assignedRole || app.assignedTeam) {
//                     idCard.style.display = 'block';
//                     // Populate User Name
//                     document.getElementById('cardName').textContent = app.fullName || user.username;

//                     document.getElementById('cardRole').textContent = app.assignedRole || 'N/A';
//                     document.getElementById('cardTeam').textContent = app.assignedTeam || 'N/A';
//                     document.getElementById('cardLeader').textContent = app.assignedLeader || 'N/A';
//                     document.getElementById('cardPost').textContent = app.assignedPost || 'N/A';
//                     document.getElementById('cardWork').textContent = app.assignedWork || 'None';
//                 }
//             } else {
//                 // Pending Review
//                 statusBadge.textContent = 'PENDING REVIEW';
//                 statusBadge.className = 'badge badge-pending';
//             }

//             // --- 4. SHOW APPLICATION SUMMARY (For Pending/Approved) ---
//             details.style.display = 'block';
//             document.getElementById('appRole').textContent = app.primarySkillset || app.department || 'N/A';
//             document.getElementById('appExp').textContent = (app.yearsExperience || '0') + " Years";
//             document.getElementById('appDate').textContent = new Date(app.createdAt).toLocaleDateString();

//         } else {
//             document.getElementById('formStatusBadge').textContent = 'NOT SUBMITTED';
//             document.getElementById('formCTA').style.display = 'block';
//         }
//     } catch (err) { console.error(err); }
// }

// function openEditModal() { document.getElementById('editModal').style.display = 'flex'; }
// function closeEditModal() { document.getElementById('editModal').style.display = 'none'; }

// document.getElementById('fileInput').addEventListener('change', function () {
//     if (this.files && this.files[0]) {
//         document.getElementById('fileName').textContent = this.files[0].name;
//     }
// });

// document.getElementById('editForm').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const newName = document.getElementById('editName').value;
//     const newBio = document.getElementById('editBio').value;
//     const fileInput = document.getElementById('fileInput');

//     let base64Image = null;

//     if (fileInput.files && fileInput.files[0]) {
//         base64Image = await toBase64(fileInput.files[0]);
//     }

//     try {
//         const payload = {
//             username: newName,
//             bio: newBio,
//             profilePic: base64Image
//         };

//         const res = await fetch('/api/user/update', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload)
//         });

//         const result = await res.json();
//         if (result.success) {
//             closeEditModal();
//             loadProfile();
//         } else {
//             alert('Update failed');
//         }
//     } catch (err) {
//         console.error(err);
//     }
// });

// const toBase64 = file => new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = error => reject(error);
// });

// document.addEventListener("DOMContentLoaded", async () => {
//     try {
//         const res = await fetch('/auth/check-status');
//         const data = await res.json();

//         const navSignup = document.getElementById('nav-signup');
//         const navProfile = document.getElementById('nav-profile');
//         const mobileSignup = document.getElementById('mobile-signup');
//         const mobileProfile = document.getElementById('mobile-profile');

//         if (data.loggedIn) {
//             if (navSignup) navSignup.style.display = 'none';
//             if (navProfile) navProfile.style.display = 'block';
//             if (mobileSignup) mobileSignup.style.display = 'none';
//             if (mobileProfile) mobileProfile.style.display = 'block';
//         } else {
//             if (navSignup) navSignup.style.display = 'block';
//             if (navProfile) navProfile.style.display = 'none';
//             if (mobileSignup) mobileSignup.style.display = 'block';
//             if (mobileProfile) mobileProfile.style.display = 'none';
//         }
//     } catch (err) {
//         console.error(err);
//     }
// });

// document.addEventListener('DOMContentLoaded', () => {
//     initMobileNav();
// });

// function initMobileNav() {
//     const hamburger = document.getElementById('hamburger');
//     const mobileNav = document.getElementById('mobileNav');
//     const overlay = document.getElementById('mobileNavOverlay');
//     const closeNav = document.getElementById('closeNav');
//     const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

//     function toggleMenu() {
//         if (!mobileNav || !overlay) return;
//         mobileNav.classList.toggle('active');
//         overlay.classList.toggle('active');
//         document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
//     }

//     if (hamburger) hamburger.addEventListener('click', toggleMenu);
//     if (closeNav) closeNav.addEventListener('click', toggleMenu);
//     if (overlay) overlay.addEventListener('click', toggleMenu);
//     mobileLinks.forEach(link => {
//         link.addEventListener('click', toggleMenu);
//     });

//     let touchStartX = 0;
//     let touchEndX = 0;

//     document.addEventListener('touchstart', e => {
//         touchStartX = e.changedTouches[0].screenX;
//     }, false);

//     document.addEventListener('touchend', e => {
//         touchEndX = e.changedTouches[0].screenX;
//         if (touchEndX < touchStartX - 50 && mobileNav.classList.contains('active')) {
//             toggleMenu();
//         }
//         if (touchEndX > touchStartX + 50 && touchStartX < 30 && !mobileNav.classList.contains('active')) {
//             toggleMenu();
//         }
//     }, false);
// }

document.addEventListener('DOMContentLoaded', loadProfile);

let currentUser = {};

async function loadProfile() {
    try {
        const res = await fetch('/api/user/profile');
        if (res.status === 401) return window.location.href = '/login';

        const data = await res.json();
        const user = data.user;
        currentUser = user;

        document.getElementById('profilePic').src = user.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        document.getElementById('fullName').textContent = user.username || 'User';
        document.getElementById('username').textContent = user.username || 'user';
        document.getElementById('bio').textContent = user.bio || 'No bio available';
        document.getElementById('email').textContent = user.email;
        document.getElementById('joinedDate').textContent = new Date(user.createdAt).toLocaleDateString();

        document.getElementById('editName').value = user.username;
        document.getElementById('editBio').value = user.bio;

        if (data.hasSubmitted) {
            const app = data.applicationData;

            // --- 1. SHOW ADMIN MESSAGE & WORK (Always visible if they exist) ---
            if (app.adminMessage) {
                document.getElementById('cardUpdateBox').style.display = 'block';
                document.getElementById('cardUpdateMsg').textContent = app.adminMessage;
            }

            if (app.assignedWork) {
                document.getElementById('sidebarWorkBox').style.display = 'block';
                document.getElementById('sidebarWorkText').textContent = app.assignedWork;
            }

            // --- 2. STATUS CHECKS ---
            const statusBadge = document.getElementById('formStatusBadge');
            const cta = document.getElementById('formCTA');

            cta.style.display = 'none'; // Default hidden

            if (app.status === 'blocked') {
                statusBadge.textContent = 'BLOCKED';
                statusBadge.className = 'badge badge-danger';
                cta.innerHTML = `<p style="color: #ff3333; font-weight: bold;"><i class="fas fa-ban"></i> You are temporarily blocked. Contact admin.</p>`;
                cta.style.display = 'block';
                return;
            }

            if (app.status === 'rejected') {
                statusBadge.textContent = 'REJECTED';
                statusBadge.className = 'badge badge-danger';
                cta.innerHTML = `
                    <p style="color: orange; font-weight: bold; margin-bottom: 10px;"><i class="fas fa-exclamation-circle"></i> Application rejected!</p>
                    <a href="/auth/joinus" class="cta-button primary" style="background: orange; color: #000; font-weight: 700;"><i class="fas fa-redo"></i> Refill Application</a>
                `;
                cta.style.display = 'block';
                return;
            }

            // --- 3. APPROVED / PENDING ---
            if (['checked', 'approved', 'reviewed'].includes(app.status)) {
                statusBadge.textContent = 'APPROVED';
                statusBadge.className = 'badge badge-success';

                if (app.assignedRole || app.assignedTeam) {
                    document.getElementById('idCardContainer').style.display = 'block';
                    document.getElementById('cardName').textContent = app.fullName || user.username;
                    document.getElementById('cardRole').textContent = app.assignedRole || 'N/A';
                    document.getElementById('cardTeam').textContent = app.assignedTeam || 'N/A';
                    document.getElementById('cardLeader').textContent = app.assignedLeader || 'N/A';
                    document.getElementById('cardPost').textContent = app.assignedPost || 'N/A';
                }
            } else {
                statusBadge.textContent = 'PENDING REVIEW';
                statusBadge.className = 'badge badge-pending';
            }

            document.getElementById('formDetails').style.display = 'block';
            document.getElementById('appRole').textContent = app.primarySkillset || app.department || 'N/A';
            document.getElementById('appExp').textContent = (app.yearsExperience || '0') + " Years";
            document.getElementById('appDate').textContent = new Date(app.createdAt).toLocaleDateString();

        } else {
            document.getElementById('formStatusBadge').textContent = 'NOT SUBMITTED';
            document.getElementById('formCTA').style.display = 'block';
        }
    } catch (err) { console.error(err); }
}

function openEditModal() { document.getElementById('editModal').style.display = 'flex'; }
function closeEditModal() { document.getElementById('editModal').style.display = 'none'; }

document.getElementById('fileInput').addEventListener('change', function () {
    if (this.files && this.files[0]) document.getElementById('fileName').textContent = this.files[0].name;
});

document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    let base64Image = null;
    if (fileInput.files && fileInput.files[0]) base64Image = await toBase64(fileInput.files[0]);

    try {
        const payload = {
            username: document.getElementById('editName').value,
            bio: document.getElementById('editBio').value,
            profilePic: base64Image
        };
        const res = await fetch('/api/user/update', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success) { closeEditModal(); loadProfile(); } else { alert('Update failed'); }
    } catch (err) { console.error(err); }
});

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result); reader.onerror = error => reject(error);
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch('/auth/check-status');
        const data = await res.json();
        if (data.loggedIn) {
            document.getElementById('nav-signup').style.display = 'none';
            document.getElementById('nav-profile').style.display = 'block';
            document.getElementById('mobile-signup').style.display = 'none';
            document.getElementById('mobile-profile').style.display = 'block';
        } else {
            document.getElementById('nav-signup').style.display = 'block';
            document.getElementById('nav-profile').style.display = 'none';
            document.getElementById('mobile-signup').style.display = 'block';
            document.getElementById('mobile-profile').style.display = 'none';
        }
    } catch (err) { console.error(err); }
});

document.addEventListener('DOMContentLoaded', () => { initMobileNav(); });

function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const overlay = document.getElementById('mobileNavOverlay');
    const closeNav = document.getElementById('closeNav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    function toggleMenu() {
        if (!mobileNav || !overlay) return;
        mobileNav.classList.toggle('active'); overlay.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    }

    if (hamburger) hamburger.addEventListener('click', toggleMenu);
    if (closeNav) closeNav.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => { link.addEventListener('click', toggleMenu); });
}