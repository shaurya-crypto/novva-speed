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

                const thead = document.createElement('thead');
                thead.innerHTML = `
                    <tr style="border-bottom: 1px solid var(--accent-cyan);">
                        <th style="text-align: left; padding: 5px; color: var(--accent-cyan);">Name</th>
                        <th style="text-align: left; padding: 5px; color: var(--accent-cyan);">Role</th>
                        <th style="text-align: left; padding: 5px; color: var(--accent-cyan);">Contact</th>
                    </tr>
                `;
                table.appendChild(thead);

                const tbody = document.createElement('tbody');

                const members = (app.assignedTeamMembers || '').split(',');
                const roles = (app.assignedTeamRoles || '').split(',');
                const contacts = (app.assignedTeamContact || '').split(',');

                members.forEach((member, index) => {
                    const name = member.trim();
                    if (name) {
                        const role = roles[index] ? roles[index].trim() : '-';
                        const contact = contacts[index] ? contacts[index].trim() : '-';

                        const row = document.createElement('tr');
                        row.style.borderBottom = '1px solid rgba(255,255,255,0.1)';

                        row.innerHTML = `
                            <td style="padding: 8px 5px; color: #fff;">${name}</td>
                            <td style="padding: 8px 5px; color: #ccc;">${role}</td>
                            <td style="padding: 8px 5px; color: #ccc;">${contact}</td>
                        `;
                        tbody.appendChild(row);
                    }
                });

                table.appendChild(tbody);
                teamListDiv.appendChild(table);
            }

            const statusBadge = document.getElementById('formStatusBadge');
            const cta = document.getElementById('formCTA');

            cta.style.display = 'none';

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

            if (['checked', 'approved', 'reviewed'].includes(app.status)) {
                statusBadge.textContent = 'APPROVED';
                statusBadge.className = 'badge badge-success';

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