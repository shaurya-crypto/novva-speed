let loadedApps = [];
let loadedUsers = [];
let loadedProjects = [];
let currentEditStatus = '';
let currentAdminName = '';

let filterAdminName = '';
let filterSpecificDate = '';

function getAuthHeader() {
    const creds = sessionStorage.getItem('adminCreds');
    return creds ? 'Basic ' + creds : null;
}

function checkAuth() {
    if (!getAuthHeader()) {
        const username = prompt("Enter Admin Username:");
        const password = prompt("Enter Admin Password:");
        if (username && password) {
            sessionStorage.setItem('adminCreds', btoa(username + ':' + password));
            sessionStorage.setItem('currentAdminName', username);
            return true;
        } else {
            return false;
        }
    }
    return true;
}

function logout() {
    sessionStorage.removeItem('adminCreds');
    sessionStorage.removeItem('currentAdminName');
    window.location.reload();
}

function init() {
    if (!checkAuth()) {
        document.body.innerHTML = "<h2 style='color:white;text-align:center;margin-top:50px'>Access Denied</h2>";
        return;
    }
    loadApps();
    loadUsers();
    loadProjects();
    loadAnnouncements();
}

function switchTab(selectedTab) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    const activeSection = document.getElementById(selectedTab + '-section');
    if (activeSection) activeSection.classList.add('active');

    const buttons = document.querySelectorAll('.tab-btn');
    if (selectedTab === 'apps' && buttons[0]) buttons[0].classList.add('active');
    if (selectedTab === 'users' && buttons[1]) buttons[1].classList.add('active');
    if (selectedTab === 'projects' && buttons[2]) buttons[2].classList.add('active');
    if (selectedTab === 'announcements' && buttons[3]) buttons[3].classList.add('active');

    if (selectedTab === 'apps') loadApps();
    if (selectedTab === 'users') loadUsers();
    if (selectedTab === 'projects') loadProjects();
    if (selectedTab === 'announcements') loadAnnouncements();
}

async function loadApps() {
    try {
        const res = await fetch('/api/applications', { headers: { 'Authorization': getAuthHeader() } });
        if (res.status === 401) { logout(); return; }
        loadedApps = await res.json();
        applyFilters();
    } catch (e) { console.error(e); }
}

function filterByAdmin() {
    const name = prompt("Enter Admin Name to filter by:");
    const btn = document.getElementById('btnAdminFilter');

    if (name && name.trim() !== "") {
        filterAdminName = name.trim();
        btn.classList.add('active-filter');
        btn.innerHTML = `<i class="fas fa-user-shield"></i> ${filterAdminName} (x)`;
    } else {
        filterAdminName = '';
        btn.classList.remove('active-filter');
        btn.innerHTML = `<i class="fas fa-user-shield"></i> By Admin`;
    }
    applyFilters();
}

function filterByDate() {
    const dateStr = prompt("Enter Date (YYYY-MM-DD):");
    const btn = document.getElementById('btnDateFilter');

    if (dateStr && dateStr.trim() !== "") {
        filterSpecificDate = dateStr.trim();
        btn.classList.add('active-filter');
        btn.innerHTML = `<i class="fas fa-calendar-day"></i> ${filterSpecificDate} (x)`;
    } else {
        filterSpecificDate = '';
        btn.classList.remove('active-filter');
        btn.innerHTML = `<i class="fas fa-calendar-day"></i> By Date`;
    }
    applyFilters();
}

function resetFilters() {
    document.getElementById('sortDate').value = 'newest';
    document.getElementById('filterStatus').value = 'all';
    document.getElementById('filterRole').value = 'all';

    filterAdminName = '';
    filterSpecificDate = '';

    const adminBtn = document.getElementById('btnAdminFilter');
    adminBtn.classList.remove('active-filter');
    adminBtn.innerHTML = `<i class="fas fa-user-shield"></i> By Admin`;

    const dateBtn = document.getElementById('btnDateFilter');
    dateBtn.classList.remove('active-filter');
    dateBtn.innerHTML = `<i class="fas fa-calendar-day"></i> By Date`;

    applyFilters();
}

function applyFilters() {
    const sortValue = document.getElementById('sortDate').value;
    const statusValue = document.getElementById('filterStatus').value;
    const roleValue = document.getElementById('filterRole').value;

    let filtered = [...loadedApps];

    if (statusValue !== 'all') {
        filtered = filtered.filter(app => {
            const status = app.status || 'pending';
            return status === statusValue;
        });
    }

    if (roleValue !== 'all') {
        filtered = filtered.filter(app => {
            const dept = (app.department || '').toLowerCase();
            return dept.includes(roleValue);
        });
    }

    if (filterAdminName) {
        filtered = filtered.filter(app => {
            const reviewed = (app.reviewedBy || '').toLowerCase();
            return reviewed.includes(filterAdminName.toLowerCase());
        });
    }

    if (filterSpecificDate) {
        filtered = filtered.filter(app => {
            const appDate = new Date(app.createdAt).toISOString().split('T')[0];
            return appDate === filterSpecificDate;
        });
    }

    filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortValue === 'newest' ? dateB - dateA : dateA - dateB;
    });

    renderTable(filtered);
}

function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 30px; color: #666; font-style:italic;">No applications found matching filters.</td></tr>';
        return;
    }

    let delay = 0;

    data.forEach(app => {
        const statusColors = {
            'pending': '#ffa500',
            'reviewed': '#00fff2',
            'approved': '#00ff00',
            'rejected': '#ff3333',
            'blocked': '#ff0000'
        };

        const currentStatus = app.status || 'pending';
        const reviewedBy = app.reviewedBy || '-';

        let statusBtn = '';
        if (currentStatus === 'pending') {
            statusBtn = `<button class="action-btn" onclick="toggleAppStatus('${app._id}', 'reviewed')" title="Mark Reviewed" style="color: #00ff00;"><i class="fas fa-check"></i></button>`;
        } else if (currentStatus === 'reviewed') {
            statusBtn = `<button class="action-btn" onclick="toggleAppStatus('${app._id}', 'pending')" title="Undo Review" style="color: orange;"><i class="fas fa-undo"></i></button>`;
        } else {
            statusBtn = `<button class="action-btn" onclick="toggleAppStatus('${app._id}', 'reviewed')" title="Mark Reviewed"><i class="fas fa-check"></i></button>`;
        }

        let roleDisplay = app.department || 'Talent';
        if (app.whichDev) {
            roleDisplay += ` (${app.whichDev})`;
        }

        const rowStyle = `animation-delay: ${delay}ms`;
        delay += 50;

        // Escape user data to prevent XSS
        const escapeHtml = (str) => {
            if (typeof str !== 'string') return str;
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        };

        const row = `
            <tr style="${rowStyle}">
                <td><span class="status-badge" style="background:${(statusColors[currentStatus] || '#fff')}20; color:${statusColors[currentStatus] || '#fff'}; border: 1px solid ${statusColors[currentStatus]}40;">${escapeHtml(currentStatus.toUpperCase())}</span></td>
                <td style="font-weight:bold; color:#fff;">${escapeHtml(app.fullName || '')}</td>
                <td>${escapeHtml(app.email || '')}<br><small style="color:#888;">${escapeHtml(app.phone || '')}</small></td>
                <td>${escapeHtml(roleDisplay)}</td>
                <td>${escapeHtml(String(app.yearsExperience || 'N/A'))}</td>
                <td style="color: var(--accent-cyan); font-style: italic;">${escapeHtml(reviewedBy)}</td> 
                <td>${escapeHtml(new Date(app.createdAt).toLocaleDateString())}</td>
                <td>
                    <button class="action-btn" onclick="viewDetails('app', '${escapeHtml(app._id)}')" title="View Details"><i class="fas fa-eye"></i></button>
                    <button class="action-btn" onclick="openActionMenu('${escapeHtml(app._id)}')" title="Edit Options"><i class="fas fa-pencil-alt"></i></button>
                    ${statusBtn}
                    <button class="action-btn" onclick="openRejectModal('${escapeHtml(app._id)}')" title="Reject / Block" style="color: #ff3333;"><i class="fas fa-times-circle"></i></button>
                    <button class="action-btn delete" onclick="deleteItem('/api/application/${escapeHtml(app._id)}', loadApps)" title="Delete"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
        tbody.innerHTML += row;
    });
}

async function loadUsers() {
    const res = await fetch('/api/users', { headers: { 'Authorization': getAuthHeader() } });
    if (res.ok) {
        loadedUsers = await res.json();
        const tbody = document.getElementById('usersBody');
        if (!tbody) return;
        tbody.innerHTML = '';
        loadedUsers.forEach(u => {
            const displayRole = u.role === 'client'
                ? '<span class="status-badge" style="background:rgba(255, 166, 0, 0.2); color: orange;">Client</span>'
                : '<span class="status-badge" style="background:rgba(0, 255, 242, 0.1); color: var(--accent-cyan);">Work with Us</span>';

            // Escape user data
            const escapeHtml = (str) => {
                if (typeof str !== 'string') return str;
                const div = document.createElement('div');
                div.textContent = str;
                return div.innerHTML;
            };

            tbody.innerHTML += `
                <tr>
                    <td>${escapeHtml(u.username || '')}</td>
                    <td>${escapeHtml(u.email || '')}</td>
                    <td>${displayRole}</td>
                    <td>
                        <button class="action-btn" onclick="viewDetails('user', '${escapeHtml(u._id)}')" title="View User Details"><i class="fas fa-eye"></i></button>
                        <button class="action-btn delete" onclick="deleteItem('/api/user/${escapeHtml(u._id)}', loadUsers)"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
        });
    }
}

async function loadProjects() {
    const res = await fetch('/api/admin/projects', { headers: { 'Authorization': getAuthHeader() } });
    if (res.ok) {
        loadedProjects = await res.json();
        const tbody = document.getElementById('projectsBody');
        if (!tbody) return;
        tbody.innerHTML = '';
        loadedProjects.forEach(p => {
            let color = '#aaa';
            if (p.status === 'completed') color = '#00ff00';
            if (p.status === 'processing') color = '#00fff2';

            // Escape project data
            const escapeHtml = (str) => {
                if (typeof str !== 'string') return str;
                const div = document.createElement('div');
                div.textContent = str;
                return div.innerHTML;
            };

            tbody.innerHTML += `
                <tr>
                    <td><span style="color:${color}; font-weight:bold; font-size:0.8rem;">${escapeHtml(p.status.toUpperCase())}</span></td>
                    <td>${escapeHtml(p.title || '')}</td>
                    <td>${escapeHtml(String(p.clientId || ''))}</td>
                    <td>
                        <button class="action-btn" onclick="editProject('${escapeHtml(p._id)}', '${escapeHtml(p.assignedTeam || '')}', '${escapeHtml(p.status)}')"><i class="fas fa-pencil-alt"></i></button>
                        <button class="action-btn delete" onclick="deleteItem('/api/admin/project/${escapeHtml(p._id)}', loadProjects)"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
        });
    }
}

async function loadAnnouncements() {
    const res = await fetch('/api/announcements');
    const data = await res.json();

    const tbody = document.getElementById('announcementBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    data.forEach(item => {
        // Escape announcement data
        const escapeHtml = (str) => {
            if (typeof str !== 'string') return str;
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        };

        tbody.innerHTML += `
            <tr>
                <td>${escapeHtml(new Date(item.createdAt).toLocaleDateString())}</td>
                <td>${escapeHtml(item.title || '')}</td>
                <td>${escapeHtml(item.type.toUpperCase())}</td>
                <td>
                    <button class="action-btn delete" onclick="deleteItem('/api/admin/announcement/${escapeHtml(item._id)}', loadAnnouncements)">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

async function postAnnouncement() {
    const title = document.getElementById('annTitle').value;
    const message = document.getElementById('annMessage').value;
    const type = document.getElementById('annType').value;

    if (!title || !message) return alert("Fill all fields");

    await fetch('/api/admin/announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
        body: JSON.stringify({ title, message, type })
    });

    document.getElementById('annTitle').value = '';
    document.getElementById('annMessage').value = '';
    loadAnnouncements();
}

async function toggleAppStatus(id, status) {
    const adminName = sessionStorage.getItem('currentAdminName') || 'Unknown';
    await fetch(`/api/application/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
        body: JSON.stringify({ status, adminName })
    });
    loadApps();
}

function viewDetails(type, id) {
    let data = null;
    let titleText = "Details";

    if (type === 'app') {
        data = loadedApps.find(x => x._id === id);
        titleText = "Application Details";
    } else if (type === 'user') {
        data = loadedUsers.find(x => x._id === id);
        titleText = "User Profile";
    } else if (type === 'project') {
        data = loadedProjects.find(x => x._id === id);
        titleText = "Project Manifest";
    }

    if (!data) return alert("Data not found");
    const w = window.open('', '_blank');

    let htmlContent = '';
    const orderedKeys = [
        'username', 'email', 'role', 'isAdmin', 'googleId', 'createdAt',
        'status', 'reviewedBy', 'fullName', 'phone', 'age', 'city', 'lang',
        'educationStatus', 'studentClass', 'collegeCourse', 'collegeYear',
        'linkedinLink', 'portfolioLink',
        'motive', 'department', 'whichDev', 'preferredLanguage', 'prTeam', 'otherDepartment',
        'weeklyAvailability', 'longTermGoal', 'referralSource', 'timeToLearn', 'whyNovaa',
        'assignedRole', 'assignedTeam', 'assignedLeader', 'assignedReportingManager', 'assignedPost', 'assignedId',
        'assignedTeamMembers', 'assignedTeamRoles', 'assignedTeamContact',
        'assignedWork', 'adminMessage'
    ];

    // Sanitize function to prevent XSS
    function escapeHtml(text) {
        if (typeof text !== 'string') return text;
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    const addRow = (key, rawValue) => {
        if (['__v', 'password', '_id', 'updatedAt', 'profilePic'].includes(key)) return;

        let displayVal = rawValue;
        if (displayVal === undefined || displayVal === null || displayVal === '') return;
        if (Array.isArray(displayVal)) displayVal = displayVal.length === 0 ? 'N/A' : displayVal.join(', ');

        let displayKey = escapeHtml(key.replace(/([A-Z])/g, ' $1').trim().toUpperCase());

        if (key.toLowerCase().includes('link') && typeof rawValue === 'string') {
            const safeUrl = escapeHtml(rawValue);
            displayVal = `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" style="color:#00fff2; text-decoration:none; border-bottom:1px solid #00fff2; transition: all 0.3s;">Open Link <i class="fas fa-external-link-alt" style="font-size:0.8em"></i></a>`;
        } else if (key.toLowerCase().includes('date') || key === 'createdAt') {
            displayVal = escapeHtml(new Date(rawValue).toLocaleString());
        } else if (key === 'isAdmin') {
            displayVal = rawValue ? 'Yes' : 'No';
        } else {
            displayVal = escapeHtml(String(displayVal));
        }

        htmlContent += `
            <div class="detail-item">
                <div class="detail-label">${displayKey}</div>
                <div class="detail-value">${displayVal}</div>
            </div>`;
    };

    orderedKeys.forEach(k => { if (data[k] !== undefined) addRow(k, data[k]); });
    Object.keys(data).forEach(k => { if (!orderedKeys.includes(k) && data[k] !== undefined) addRow(k, data[k]); });

    const safeTitle = escapeHtml(titleText);
    w.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${safeTitle} | Novaa Admin</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
            <style>
                body {
                    background-color: #050505;
                    background-image: radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000 100%);
                    color: #fff;
                    font-family: 'Segoe UI', sans-serif;
                    padding: 40px;
                    margin: 0;
                }
                .container {
                    max-width: 900px;
                    margin: 0 auto;
                    background: rgba(20, 20, 20, 0.8);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 30px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
                }
                h2 {
                    color: #00fff2;
                    border-bottom: 2px solid #333;
                    padding-bottom: 20px;
                    margin-top: 0;
                    margin-bottom: 30px;
                    font-size: 1.8rem;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    text-shadow: 0 0 15px rgba(0, 255, 242, 0.3);
                }
                .detail-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }
                .detail-item {
                    background: rgba(255, 255, 255, 0.03);
                    padding: 20px;
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: transform 0.2s, border-color 0.2s;
                }
                .detail-item:hover {
                    transform: translateY(-3px);
                    border-color: rgba(0, 255, 242, 0.3);
                    background: rgba(255, 255, 255, 0.05);
                }
                .detail-label {
                    color: #00fff2;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    margin-bottom: 8px;
                    font-weight: 700;
                    opacity: 0.9;
                }
                .detail-value {
                    font-size: 1rem;
                    line-height: 1.5;
                    color: #e0e0e0;
                    word-wrap: break-word;
                }
                a:hover {
                    text-shadow: 0 0 8px rgba(0, 255, 242, 0.5);
                }
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: #0a0a0a; }
                ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: #00fff2; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>${safeTitle}</h2>
                <div class="detail-grid">
                    ${htmlContent}
                </div>
            </div>
        </body>
        </html>
    `);
}

function deleteItem(url, callback) {
    if (confirm("Permanently Delete?")) {
        fetch(url, { method: 'DELETE', headers: { 'Authorization': getAuthHeader() } }).then(() => callback());
    }
}

function openActionMenu(id) {
    document.getElementById('menuAppId').value = id;
    document.getElementById('actionMenuModal').style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function openAssignIdModal() {
    const id = document.getElementById('menuAppId').value;
    const app = loadedApps.find(x => x._id === id) || {};

    document.getElementById('simpleId').value = app.assignedId || Math.floor(1000 + Math.random() * 9000);
    document.getElementById('simpleRole').value = app.assignedRole || '';
    document.getElementById('simpleTeam').value = app.assignedTeam || '';
    document.getElementById('simpleLeader').value = app.assignedLeader || '';
    document.getElementById('simpleReportingManager').value = app.assignedReportingManager || '';
    document.getElementById('simplePost').value = app.assignedPost || '';

    closeModal('actionMenuModal');
    document.getElementById('simpleIdModal').style.display = 'flex';
}

async function submitIdCard() {
    const id = document.getElementById('menuAppId').value;
    const payload = {
        assignedId: document.getElementById('simpleId').value,
        assignedRole: document.getElementById('simpleRole').value,
        assignedTeam: document.getElementById('simpleTeam').value,
        assignedLeader: document.getElementById('simpleLeader').value,
        assignedReportingManager: document.getElementById('simpleReportingManager').value,
        assignedPost: document.getElementById('simplePost').value,
        adminName: sessionStorage.getItem('currentAdminName')
    };

    await fetch(`/api/application/${id}/card-details`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
        body: JSON.stringify(payload)
    });

    closeModal('simpleIdModal');
    loadApps();
}

function openTeamInfoModal() {
    const id = document.getElementById('menuAppId').value;
    const app = loadedApps.find(x => x._id === id) || {};
    document.getElementById('teamMembersInput').value = app.assignedTeamMembers || '';
    document.getElementById('teamRolesInput').value = app.assignedTeamRoles || '';
    document.getElementById('teamContactInput').value = app.assignedTeamContact || '';
    closeModal('actionMenuModal');
    document.getElementById('teamInfoModal').style.display = 'flex';
}

async function submitTeamInfo() {
    const id = document.getElementById('menuAppId').value;
    const payload = {
        assignedTeamMembers: document.getElementById('teamMembersInput').value,
        assignedTeamRoles: document.getElementById('teamRolesInput').value,
        assignedTeamContact: document.getElementById('teamContactInput').value,
        adminName: sessionStorage.getItem('currentAdminName')
    };
    await fetch(`/api/application/${id}/card-details`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
        body: JSON.stringify(payload)
    });
    closeModal('teamInfoModal');
    loadApps();
}

function openMessageModal() {
    const id = document.getElementById('menuAppId').value;
    const app = loadedApps.find(x => x._id === id) || {};
    document.getElementById('adminMsgInput').value = app.adminMessage || '';
    closeModal('actionMenuModal');
    document.getElementById('messageModal').style.display = 'flex';
}

async function submitAdminMessage() {
    const id = document.getElementById('menuAppId').value;
    await fetch(`/api/application/${id}/card-details`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
        body: JSON.stringify({
            adminMessage: document.getElementById('adminMsgInput').value,
            adminName: sessionStorage.getItem('currentAdminName')
        })
    });
    closeModal('messageModal');
    loadApps();
}

function openWorkModal() {
    const id = document.getElementById('menuAppId').value;
    const app = loadedApps.find(x => x._id === id) || {};
    document.getElementById('workInput').value = app.assignedWork || '';
    closeModal('actionMenuModal');
    document.getElementById('workModal').style.display = 'flex';
}

async function submitWork() {
    const id = document.getElementById('menuAppId').value;
    await fetch(`/api/application/${id}/card-details`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
        body: JSON.stringify({
            assignedWork: document.getElementById('workInput').value,
            adminName: sessionStorage.getItem('currentAdminName')
        })
    });
    closeModal('workModal');
    loadApps();
}

function editProject(id, team, status) {
    document.getElementById('editProjectId').value = id;
    if (document.getElementById('teamInput')) document.getElementById('teamInput').value = team;
    document.getElementById('projectModal').style.display = 'flex';
    currentEditStatus = status;
}

function setProjectStatus(status) {
    currentEditStatus = status;
}

async function saveProjectChanges() {
    const id = document.getElementById('editProjectId').value;
    const team = document.getElementById('teamInput') ? document.getElementById('teamInput').value : '';
    await fetch(`/api/admin/project/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
        body: JSON.stringify({ assignedTeam: team, status: currentEditStatus })
    });
    closeModal('projectModal');
    loadProjects();
}

function openRejectModal(id) {
    document.getElementById('rejectAppId').value = id;
    document.getElementById('rejectModal').style.display = 'flex';
}

async function submitRejectAction() {
    const id = document.getElementById('rejectAppId').value;
    const action = document.querySelector('input[name="rejectAction"]:checked').value;
    const adminName = sessionStorage.getItem('currentAdminName') || 'Unknown Admin';

    await fetch(`/api/application/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
        body: JSON.stringify({ status: action, adminName })
    });
    closeModal('rejectModal');
    loadApps();
}

window.onload = init;