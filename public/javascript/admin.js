let loadedApps = [];
let loadedUsers = [];
let loadedProjects = [];
let currentEditStatus = '';

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
            return true;
        } else {
            return false;
        }
    }
    return true;
}

function logout() {
    sessionStorage.removeItem('adminCreds');
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

async function viewRawData(url) {
    try {
        const res = await fetch(url, { headers: { 'Authorization': getAuthHeader() } });
        
        if (res.status === 401) {
            alert("Authentication Failed. Please login again.");
            return logout();
        }
        
        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();

        const newWin = window.open('', '_blank');
        
        newWin.document.write(`
            <html>
                <head>
                    <title>Raw Data View</title>
                    <style>
                        body { background-color: #121212; color: #00ff41; font-family: 'Courier New', monospace; padding: 20px; }
                        pre { white-space: pre-wrap; word-wrap: break-word; }
                        h2 { color: #fff; border-bottom: 1px solid #333; padding-bottom: 10px; }
                    </style>
                </head>
                <body>
                    <h2>Data Viewer</h2>
                    <pre>${JSON.stringify(data, null, 4)}</pre>
                </body>
            </html>
        `);
        newWin.document.close();

    } catch (err) {
        console.error(err);
        alert("Error loading data: " + err.message);
    }
}

async function toggleAppStatus(id, newStatus) {
    try {
        await fetch(`/api/application/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthHeader()
            },
            body: JSON.stringify({ status: newStatus })
        });
        loadApps();
    } catch(err) {
        console.error(err);
        alert("Failed to update status");
    }
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
                'rejected': '#ff3333' 
            };

            let statusBtn = '';
            if (app.status === 'pending') {
                statusBtn = `<button class="action-btn" onclick="toggleAppStatus('${app._id}', 'reviewed')" title="Mark Reviewed" style="color: #00ff00;"><i class="fas fa-check"></i></button>`;
            } else if (app.status === 'reviewed') {
                statusBtn = `<button class="action-btn" onclick="toggleAppStatus('${app._id}', 'pending')" title="Undo Review" style="color: orange;"><i class="fas fa-undo"></i></button>`;
            } else {
                statusBtn = `<button class="action-btn" onclick="toggleAppStatus('${app._id}', 'reviewed')" title="Mark Reviewed"><i class="fas fa-check"></i></button>`;
            }

            const row = `
                <tr>
                    <td><span class="status-badge" style="background:${(statusColors[app.status] || '#fff')}20; color:${statusColors[app.status] || '#fff'}">${app.status.toUpperCase()}</span></td>
                    <td>${app.fullName}</td>
                    <td>${app.email}<br><small>${app.phone}</small></td>
                    <td>Talent</td>
                    <td>${app.yearsExperience || 'N/A'}</td>
                    <td>${new Date(app.createdAt).toLocaleDateString()}</td>
                    <td>
                        <button class="action-btn" onclick="viewRawData('/api/application/allinfo/${app._id}')" title="View Raw JSON"><i class="fas fa-eye"></i></button>
                        ${statusBtn}
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
                        <button class="action-btn" onclick="viewRawData('/api/user/allinfo/${user._id}')" title="View Raw JSON"><i class="fas fa-eye"></i></button>
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
                        <button class="action-btn" onclick="viewRawData('/api/admin/project/${p._id}')" title="View Raw JSON"><i class="fas fa-eye"></i></button>
                        <button class="action-btn" onclick="editProject('${p._id}', '${p.assignedTeam || ''}', '${p.status}')" title="Edit"><i class="fas fa-pencil-alt"></i></button>
                        <button class="action-btn delete" onclick="deleteItem('/api/admin/project/${p._id}', loadProjects)" title="Delete"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
            tbody.innerHTML += row;
        });
    } catch (err) { console.error(err); }
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

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function deleteItem(url, reloadCallback) {
    if (confirm('Are you sure you want to permanently delete this?')) {
        fetch(url, { method: 'DELETE', headers: { 'Authorization': getAuthHeader() } })
            .then(() => reloadCallback());
    }
}

window.onload = init;