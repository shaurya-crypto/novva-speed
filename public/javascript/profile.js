document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    initMobileNav();
});

let currentUser = {};

async function loadProfile() {
    // ... (Your existing loadProfile code remains exactly the same) ...
    // Copy the entire loadProfile function from your previous code here
    try {
        const res = await fetch('/api/user/profile');
        if (res.status === 401) return window.location.href = '/login';

        const data = await res.json();
        const user = data.user;
        currentUser = user;

        const profileImg = document.getElementById('profilePic');
        if (profileImg) profileImg.src = user.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

        const ids = ['fullName', 'username', 'bio', 'email', 'joinedDate', 'editName', 'editBio'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (id === 'email') el.textContent = user.email;
                else if (id === 'joinedDate') el.textContent = new Date(user.createdAt).toLocaleDateString();
                else if (id.startsWith('edit')) el.value = user[id.replace('edit', '').toLowerCase()] || '';
                else el.textContent = user.username || 'User';
            }
        });

        if (data.hasSubmitted) {
            const app = data.applicationData;

            if (app.adminMessage) {
                document.getElementById('cardUpdateBox').style.display = 'block';
                document.getElementById('cardUpdateMsg').textContent = app.adminMessage;
            }

            if (app.assignedWork) {
                document.getElementById('sidebarWorkBox').style.display = 'block';
                document.getElementById('sidebarWorkText').textContent = app.assignedWork;
            }

            if (app.assignedTeamMembers) {
                document.getElementById('sidebarTeamBox').style.display = 'block';
                const teamListDiv = document.getElementById('sidebarTeamList');
                teamListDiv.innerHTML = '';

                const table = document.createElement('table');
                table.style.width = '100%';
                table.style.borderCollapse = 'collapse';
                table.style.fontSize = '0.85rem';
                table.style.marginTop = '10px';

                table.innerHTML = `
                    <thead><tr style="border-bottom: 1px solid var(--accent-cyan);">
                        <th style="text-align: left; padding: 5px; color: var(--accent-cyan);">Name</th>
                        <th style="text-align: left; padding: 5px; color: var(--accent-cyan);">Role</th>
                        <th style="text-align: left; padding: 5px; color: var(--accent-cyan);">Contact</th>
                    </tr></thead>`;

                const tbody = document.createElement('tbody');
                const members = (app.assignedTeamMembers || '').split(',');
                const roles = (app.assignedTeamRoles || '').split(',');
                const contacts = (app.assignedTeamContact || '').split(',');

                // Sanitize function to prevent XSS
                const escapeHtml = (str) => {
                    if (typeof str !== 'string') return str;
                    const div = document.createElement('div');
                    div.textContent = str;
                    return div.innerHTML;
                };

                members.forEach((member, index) => {
                    const name = member.trim();
                    if (name) {
                        const role = roles[index] ? roles[index].trim() : '-';
                        const contact = contacts[index] ? contacts[index].trim() : '-';
                        const row = document.createElement('tr');
                        row.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
                        row.innerHTML = `
                            <td style="padding: 8px 5px; color: #fff;">${escapeHtml(name)}</td>
                            <td style="padding: 8px 5px; color: #ccc;">${escapeHtml(role)}</td>
                            <td style="padding: 8px 5px; color: #ccc;">${escapeHtml(contact)}</td>
                        `;
                        tbody.appendChild(row);
                    }
                });
                table.appendChild(tbody);
                teamListDiv.appendChild(table);
            }

            // ... (Rest of ID Card/Status logic) ...
            if (['checked', 'approved', 'reviewed'].includes(app.status)) {
                document.getElementById('formStatusBadge').textContent = 'APPROVED';
                document.getElementById('formStatusBadge').className = 'badge badge-success';

                if (app.assignedRole || app.assignedTeam) {
                    document.getElementById('idCardContainer').style.display = 'block';
                    document.getElementById('cardId').textContent = app.assignedId || '####';
                    document.getElementById('cardName').textContent = app.fullName || user.username;
                    document.getElementById('cardRole').textContent = app.assignedRole || 'N/A';
                    document.getElementById('cardTeam').textContent = app.assignedTeam || 'N/A';
                    document.getElementById('cardLeader').textContent = app.assignedLeader || 'N/A';
                    document.getElementById('cardReportingManager').textContent = app.assignedReportingManager || 'N/A';
                    document.getElementById('cardPost').textContent = app.assignedPost || 'N/A';
                }
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

// --- CRITICAL FIX: FORCE MODAL VISIBILITY ---

window.openSwitchModal = function () {
    const modal = document.getElementById('switchModal');
    if (modal) {
        // 1. Move modal to the absolute end of body to escape any container clipping
        document.body.appendChild(modal);

        // 2. Force CSS styles directly via JS
        modal.style.display = 'flex';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'; // Darker background
        modal.style.zIndex = '2147483647'; // Max integer value
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.backdropFilter = 'blur(5px)';

        console.log("Modal forced open");
    } else {
        console.error("Switch modal not found in DOM");
    }
}

window.closeSwitchModal = function () {
    const modal = document.getElementById('switchModal');
    if (modal) modal.style.display = 'none';
}

// --- Rest of standard functions ---

window.openEditModal = function () {
    document.getElementById('editModal').style.display = 'flex';
}
window.closeEditModal = function () {
    document.getElementById('editModal').style.display = 'none';
}

window.confirmSwitch = async function () {
    try {
        const res = await fetch('/api/user/switch-role', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
            window.location.href = '/dashboard';
        } else {
            alert('Error switching profile.');
        }
    } catch (err) {
        console.error(err);
        alert('Server connection failed.');
    }
}

// File Input Listeners
const fileInput = document.getElementById('fileInput');
if (fileInput) {
    fileInput.addEventListener('change', function () {
        if (this.files && this.files[0]) document.getElementById('fileName').textContent = this.files[0].name;
    });
}

const editForm = document.getElementById('editForm');
if (editForm) {
    editForm.addEventListener('submit', async (e) => {
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
            if (result.success) { window.closeEditModal(); loadProfile(); } else { alert('Update failed'); }
        } catch (err) { console.error(err); }
    });
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result); reader.onerror = error => reject(error);
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch('/auth/check-status');
        const data = await res.json();
        const navSignup = document.getElementById('nav-signup');
        const navProfile = document.getElementById('nav-profile');

        if (data.loggedIn) {
            if (navSignup) navSignup.style.display = 'none';
            if (navProfile) navProfile.style.display = 'block';
            document.getElementById('mobile-signup').style.display = 'none';
            document.getElementById('mobile-profile').style.display = 'block';
        }
    } catch (err) { console.error(err); }
});

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