let loadedApps = [];
let loadedUsers = [];
let loadedProjects = [];
let currentEditStatus = '';
let currentAdminName = ''; // Global variable

function getAuthHeader() {
    const creds = sessionStorage.getItem('adminCreds');
    return creds ? 'Basic ' + creds : null;
}

function checkAuth() {
    if (!getAuthHeader()) {
        const username = prompt("Enter Admin Username(APNA NAAM DAAL DO):");
        const password = prompt("Enter Admin Password:");
        if (username && password) {
            sessionStorage.setItem('adminCreds', btoa(username + ':' + password));
            // Store admin name locally for tracking actions
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
    if (!checkAuth()) return;
    loadApps();
    loadUsers();
    loadProjects();
}

function switchTab(tabName) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName + '-section').classList.add('active');

    const btns = document.querySelectorAll('.tab-btn');
    if (tabName === 'apps') btns[0].classList.add('active');
    if (tabName === 'users') btns[1].classList.add('active');
    if (tabName === 'projects') btns[2].classList.add('active');

    if (tabName === 'apps') loadApps();
    if (tabName === 'users') loadUsers();
    if (tabName === 'projects') loadProjects();
}

async function loadApps() {
    try {
        const res = await fetch('/api/applications', { headers: { 'Authorization': getAuthHeader() } });
        if (res.status === 401) { logout(); return; }
        loadedApps = await res.json();

        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = '';

        loadedApps.forEach(app => {
            const statusColors = {
                'pending': '#ffa500',
                'reviewed': '#00fff2',
                'approved': '#00ff00',
                'rejected': '#ff3333',
                'blocked': '#ff0000'
            };

            const currentStatus = app.status || 'pending';
            // Display who reviewed/accepted the application
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

            const row = `
                <tr>
                    <td><span class="status-badge" style="background:${(statusColors[currentStatus] || '#fff')}20; color:${statusColors[currentStatus] || '#fff'}">${currentStatus.toUpperCase()}</span></td>
                    <td>${app.fullName}</td>
                    <td>${app.email}<br><small>${app.phone}</small></td>
                    <td>${roleDisplay}</td>
                    <td>${app.yearsExperience || 'N/A'}</td>
                    <td style="color: #aaa; font-style: italic;">${reviewedBy}</td> 
                    <td>${new Date(app.createdAt).toLocaleDateString()}</td>
                    <td>
                        <button class="action-btn" onclick="viewDetails('app', '${app._id}')" title="View Details"><i class="fas fa-eye"></i></button>
                        <button class="action-btn" onclick="openActionMenu('${app._id}')" title="Edit Options"><i class="fas fa-pencil-alt"></i></button>
                        ${statusBtn}
                        <button class="action-btn" onclick="openRejectModal('${app._id}')" title="Reject / Block" style="color: #ff3333;"><i class="fas fa-times-circle"></i></button>
                        <button class="action-btn delete" onclick="deleteItem('/api/application/${app._id}', loadApps)" title="Delete"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
            tbody.innerHTML += row;
        });
    } catch (err) { console.error(err); }
}

async function loadUsers() {
    try {
        const res = await fetch('/api/users', { headers: { 'Authorization': getAuthHeader() } });
        if (res.status === 401) return logout();
        loadedUsers = await res.json();

        const tbody = document.getElementById('usersBody');
        tbody.innerHTML = '';

        loadedUsers.forEach(user => {
            const displayRole = user.role === 'client'
                ? '<span class="status-badge" style="background:rgba(255, 166, 0, 0.2); color: orange;">Client</span>'
                : '<span class="status-badge" style="background:rgba(0, 255, 242, 0.1); color: var(--accent-cyan);">Work with Us</span>';

            const row = `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${displayRole}</td>
                    <td>${user.isAdmin ? 'Yes' : 'No'}</td>
                    <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                        <button class="action-btn" onclick="viewDetails('user', '${user._id}')" title="View Details"><i class="fas fa-eye"></i></button>
                        <button class="action-btn delete" onclick="deleteItem('/api/user/${user._id}', loadUsers)" title="Delete"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
            tbody.innerHTML += row;
        });
    } catch (err) { console.error(err); }
}

async function loadProjects() {
    try {
        const res = await fetch('/api/admin/projects', { headers: { 'Authorization': getAuthHeader() } });
        if (res.status === 401) return logout();
        if (!res.ok) return;
        loadedProjects = await res.json();

        const tbody = document.getElementById('projectsBody');
        tbody.innerHTML = '';

        loadedProjects.forEach(p => {
            let color = '#aaa';
            if (p.status === 'completed') color = '#00ff00';
            if (p.status === 'processing') color = '#00fff2';

            const row = `
                <tr>
                    <td><span style="color:${color}; font-weight:bold; font-size:0.8rem;">${p.status.toUpperCase()}</span></td>
                    <td>${p.title}</td>
                    <td>${p.clientId || 'Guest Client'}</td>
                    <td>${p.assignedTeam || '<span style="color:#555">Unassigned</span>'}</td>
                    <td>${new Date(p.createdAt).toLocaleDateString()}</td>
                    <td class="action-cell">
                        <button class="action-btn" onclick="viewDetails('project', '${p._id}')" title="View Details"><i class="fas fa-eye"></i></button>
                        <button class="action-btn" onclick="editProject('${p._id}', '${p.assignedTeam || ''}', '${p.status}')" title="Edit"><i class="fas fa-pencil-alt"></i></button>
                        <button class="action-btn delete" onclick="deleteItem('/api/admin/project/${p._id}', loadProjects)" title="Delete"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
            tbody.innerHTML += row;
        });
    } catch (err) { console.error(err); }
}

function viewDetails(type, id) {
    let data = null;
    let title = "Details";

    if (type === 'app') {
        data = loadedApps.find(x => x._id === id);
        title = "Application Details";
    } else if (type === 'user') {
        data = loadedUsers.find(x => x._id === id);
        title = "User Profile";
    } else if (type === 'project') {
        data = loadedProjects.find(x => x._id === id);
        title = "Project Manifest";
    }

    if (!data) return alert("Data not found");

    const newWin = window.open('', '_blank');
    let htmlContent = '';

    const orderedKeys = [
        'status', 'reviewedBy', 'createdAt',
        'fullName', 'email', 'phone', 'age', 'city', 'lang',
        'educationStatus', 'studentClass', 'collegeCourse', 'collegeYear',
        'linkedinLink', 'portfolioLink',
        'motive', 'department', 'whichDev', 'preferredLanguage', 'prTeam', 'otherDepartment',
        'weeklyAvailability', 'longTermGoal', 'referralSource', 'timeToLearn', 'whyNovaa',
        'assignedRole', 'assignedTeam', 'assignedLeader', 'assignedReportingManager', 'assignedPost', 'assignedId',
        'assignedTeamMembers', 'assignedTeamRoles', 'assignedTeamContact',
        'assignedWork', 'adminMessage'
    ];

    const addRow = (key, rawValue) => {
        if (key === '__v' || key === 'password' || key === '_id' || key === 'updatedAt') return;

        let displayVal = rawValue;

        if (displayVal === undefined || displayVal === null || displayVal === '') {
            displayVal = '<span style="color:#555">N/A</span>';
        }
        else if (Array.isArray(displayVal)) {
            if (displayVal.length === 0) {
                displayVal = '<span style="color:#555">N/A</span>';
            } else {
                displayVal = displayVal.join(', ');
            }
        }

        let displayKey = key.replace(/([A-Z])/g, ' $1').trim().toUpperCase();

        if (displayVal !== '<span style="color:#555">N/A</span>') {
            if (key.toLowerCase().includes('link')) {
                displayVal = `<a href="${rawValue}" target="_blank" style="color:#00fff2; text-decoration:none; border-bottom:1px solid #00fff2;">Open Link</a> <small style="color:#555">(${rawValue})</small>`;
            }
            else if (key.toLowerCase().includes('date') || key === 'createdAt') {
                displayVal = new Date(rawValue).toLocaleString();
            }
            else if (key === 'motive') {
                displayKey = "MEMBERSHIP TYPE";
                if (rawValue === 'learning') displayVal = '<strong style="color: #00ff00;">New Member (Joining)</strong>';
                else if (rawValue === 'projects') displayVal = '<strong style="color: #00fff2;">Old Member (Existing)</strong>';
            }
            else if (key === 'department') {
                displayVal = rawValue.charAt(0).toUpperCase() + rawValue.slice(1);
            }
        }

        htmlContent += `
            <div class="item">
                <div class="label">${displayKey}</div>
                <div class="value">${displayVal}</div>
            </div>
        `;
    };

    orderedKeys.forEach(k => {
        addRow(k, data[k]);
    });

    Object.keys(data).forEach(k => {
        if (!orderedKeys.includes(k)) {
            addRow(k, data[k]);
        }
    });

    newWin.document.write(`
        <html>
            <head>
                <title>${title} | Novaa Admin</title>
                <style>
                    body { background-color: #0a0a0a; color: #fff; font-family: 'Segoe UI', sans-serif; padding: 40px; }
                    h2 { color: #00fff2; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 30px; }
                    .item { margin-bottom: 20px; background: #111; padding: 15px; border-radius: 8px; border: 1px solid #222; }
                    .label { color: #00fff2; font-size: 0.8rem; margin-bottom: 8px; opacity: 0.8; letter-spacing: 1px; font-weight: bold; }
                    .value { font-size: 1.1rem; word-wrap: break-word; line-height: 1.6; color: #e0e0e0; }
                    a:hover { color: #fff !important; border-color: #fff !important; }
                </style>
            </head>
            <body>
                <h2>${title}</h2>
                ${htmlContent}
            </body>
        </html>
    `);
    newWin.document.close();
}

async function toggleAppStatus(id, newStatus) {
    try {
        // Capture the admin name from session storage
        const adminName = sessionStorage.getItem('currentAdminName') || 'Unknown Admin';

        await fetch(`/api/application/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthHeader()
            },
            body: JSON.stringify({
                status: newStatus,
                adminName: adminName // Send Admin Name
            })
        });
        loadApps();
    } catch (err) {
        console.error(err);
        alert("Failed to update status");
    }
}

function openActionMenu(id) {
    document.getElementById('menuAppId').value = id;
    document.getElementById('actionMenuModal').style.display = 'flex';
}

function generateRandomId() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function openAssignIdModal() {
    const id = document.getElementById('menuAppId').value;
    const app = loadedApps.find(x => x._id === id) || {};

    const systemId = app.assignedId || generateRandomId();
    document.getElementById('simpleId').value = systemId;

    document.getElementById('simpleRole').value = app.assignedRole || '';
    document.getElementById('simpleTeam').value = app.assignedTeam || '';
    document.getElementById('simpleLeader').value = app.assignedLeader || '';
    document.getElementById('simpleReportingManager').value = app.assignedReportingManager || '';
    document.getElementById('simplePost').value = app.assignedPost || '';

    closeModal('actionMenuModal');
    document.getElementById('simpleIdModal').style.display = 'flex';
}

function openMessageModal() {
    const id = document.getElementById('menuAppId').value;
    const app = loadedApps.find(x => x._id === id) || {};
    document.getElementById('adminMsgInput').value = app.adminMessage || '';

    closeModal('actionMenuModal');
    document.getElementById('messageModal').style.display = 'flex';
}

function openWorkModal() {
    const id = document.getElementById('menuAppId').value;
    const app = loadedApps.find(x => x._id === id) || {};
    document.getElementById('workInput').value = app.assignedWork || '';

    closeModal('actionMenuModal');
    document.getElementById('workModal').style.display = 'flex';
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

async function updateApplicationData(id, partialData) {
    const currentApp = loadedApps.find(x => x._id === id) || {};

    // Get Admin Name
    const adminName = sessionStorage.getItem('currentAdminName') || 'Unknown Admin';

    const payload = {
        assignedRole: currentApp.assignedRole,
        assignedTeam: currentApp.assignedTeam,
        assignedLeader: currentApp.assignedLeader,
        assignedReportingManager: currentApp.assignedReportingManager,
        assignedPost: currentApp.assignedPost,
        assignedId: currentApp.assignedId,
        assignedTeamMembers: currentApp.assignedTeamMembers,
        assignedTeamRoles: currentApp.assignedTeamRoles,
        assignedTeamContact: currentApp.assignedTeamContact,
        adminMessage: currentApp.adminMessage,
        assignedWork: currentApp.assignedWork,

        // Ensure every update tracks the admin
        adminName: adminName,

        ...partialData
    };

    try {
        await fetch(`/api/application/${id}/card-details`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
            body: JSON.stringify(payload)
        });
        alert('Updated successfully!');
        loadApps();
        closeModal('simpleIdModal');
        closeModal('messageModal');
        closeModal('workModal');
        closeModal('teamInfoModal');
    } catch (err) { console.error(err); alert('Failed'); }
}

function submitIdCard() {
    const id = document.getElementById('menuAppId').value;
    updateApplicationData(id, {
        assignedId: document.getElementById('simpleId').value,
        assignedRole: document.getElementById('simpleRole').value,
        assignedTeam: document.getElementById('simpleTeam').value,
        assignedLeader: document.getElementById('simpleLeader').value,
        assignedReportingManager: document.getElementById('simpleReportingManager').value,
        assignedPost: document.getElementById('simplePost').value
    });
}

function submitAdminMessage() {
    const id = document.getElementById('menuAppId').value;
    updateApplicationData(id, {
        adminMessage: document.getElementById('adminMsgInput').value
    });
}

function submitWork() {
    const id = document.getElementById('menuAppId').value;
    updateApplicationData(id, {
        assignedWork: document.getElementById('workInput').value
    });
}

function submitTeamInfo() {
    const id = document.getElementById('menuAppId').value;
    updateApplicationData(id, {
        assignedTeamMembers: document.getElementById('teamMembersInput').value,
        assignedTeamRoles: document.getElementById('teamRolesInput').value,
        assignedTeamContact: document.getElementById('teamContactInput').value
    });
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function openRejectModal(id) {
    document.getElementById('rejectAppId').value = id;
    document.getElementById('rejectModal').style.display = 'flex';
}

function closeRejectModal() {
    document.getElementById('rejectModal').style.display = 'none';
}

async function submitRejectAction() {
    const id = document.getElementById('rejectAppId').value;
    const action = document.querySelector('input[name="rejectAction"]:checked').value;
    // Capture Admin Name
    const adminName = sessionStorage.getItem('currentAdminName') || 'Unknown Admin';

    try {
        await fetch(`/api/application/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
            body: JSON.stringify({
                status: action,
                adminName: adminName // Send Admin Name
            })
        });
        closeRejectModal();
        loadApps();
        alert(`User marked as ${action.toUpperCase()}`);
    } catch (err) {
        console.error(err);
        alert("Action failed.");
    }
}

function editProject(id, team, status) {
    document.getElementById('editProjectId').value = id;
    document.getElementById('teamInput').value = team;
    document.getElementById('projectModal').style.display = 'flex';
    setProjectStatus(status);
}

function setProjectStatus(status) {
    currentEditStatus = status;
    document.querySelectorAll('.status-option').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase().replace(' ', '_').includes(status.split('_')[0])) {
            btn.classList.add('active');
        }
    });
}

async function saveProjectChanges() {
    const id = document.getElementById('editProjectId').value;
    const team = document.getElementById('teamInput').value;

    await fetch(`/api/admin/project/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
        body: JSON.stringify({ assignedTeam: team, status: currentEditStatus })
    });

    closeModal('projectModal');
    loadProjects();
}

function deleteItem(url, reloadCallback) {
    if (confirm('Are you sure you want to permanently delete this?')) {
        fetch(url, { method: 'DELETE', headers: { 'Authorization': getAuthHeader() } })
            .then(() => reloadCallback());
    }
}

window.onload = init;