// // document.addEventListener('DOMContentLoaded', fetchApplications);

// // async function fetchApplications() {
// //     try {
// //         const response = await fetch('/api/applications');
// //         const data = await response.json();
// //         renderTable(data);
// //     } catch (error) {
// //         console.error('Error fetching data:', error);
// //         alert("Failed to load data. Make sure you are logged in.");
// //     }
// // }

// // function renderTable(apps) {
// //     const tbody = document.getElementById('tableBody');
// //     tbody.innerHTML = '';

// //     if (apps.length === 0) {
// //         tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 20px;">No applications found.</td></tr>';
// //         return;
// //     }

// //     apps.forEach(app => {
// //         const tr = document.createElement('tr');
// //         const isChecked = app.status === 'checked';

// //         if (isChecked) tr.classList.add('row-checked');

// //         tr.innerHTML = `
// //             <td>
// //                 <span class="status-badge ${isChecked ? 'status-checked' : 'status-pending'}">
// //                     ${app.status.toUpperCase()}
// //                 </span>
// //             </td>
// //             <td>
// //                 <div style="font-weight:bold;">${app.fullName}</div>
// //                 <div style="font-size:0.8rem; color:#888;">${app.city}, ${app.age}yo</div>
// //             </td>
// //             <td>
// //                 <div><a href="mailto:${app.email}" class="details-link">${app.email}</a></div>
// //                 <div style="font-size:0.8rem; color:#888;">${app.phone}</div>
// //             </td>
// //             <td>
// //                 <div style="color:var(--accent-cyan);">${app.primarySkillset}</div>
// //                 <div style="font-size:0.8rem;">${app.educationStatus}</div>
// //             </td>
// //             <td>${app.yearsExperience} yrs</td>
// //             <td>${new Date(app.createdAt).toLocaleDateString()}</td>
// //             <td>
// //                 <button class="action-btn check-btn" onclick="toggleStatus('${app._id}', '${app.status}')" title="Mark Checked/Pending">
// //                     <i class="fas ${isChecked ? 'fa-undo' : 'fa-check'}"></i>
// //                 </button>
// //                 <button class="action-btn delete-btn" onclick="deleteApp('${app._id}')" title="Delete">
// //                     <i class="fas fa-trash"></i>
// //                 </button>
// //             </td>
// //         `;
// //         tbody.appendChild(tr);
// //     });
// // }

// // async function toggleStatus(id, currentStatus) {
// //     const newStatus = currentStatus === 'pending' ? 'checked' : 'pending';
// //     try {
// //         const res = await fetch(`/api/application/${id}/status`, {
// //             method: 'PATCH',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: JSON.stringify({ status: newStatus })
// //         });

// //         if (res.ok) {
// //             fetchApplications();
// //         }
// //     } catch (err) {
// //         alert('Error updating status');
// //     }
// // }

// // function allinfo(id) {
// //     let info = document.getElementById("all");
// //     info.href = `/api/application/allinfo/${id}`;
// // }

// // let info = document.getElementById("all");
// // info.addEventListener("click", allinfo);

// // async function deleteApp(id) {
// //     if (!confirm('Are you sure you want to permanently delete this application?')) return;

// //     try {
// //         const res = await fetch(`/api/application/${id}`, {
// //             method: 'DELETE'
// //         });

// //         if (res.ok) {
// //             fetchApplications();
// //         }
// //     } catch (err) {
// //         alert('Error deleting application');
// //     }
// // }

// document.addEventListener('DOMContentLoaded', fetchApplications);

// async function fetchApplications() {
//     try {
//         const response = await fetch('/api/applications');
//         const data = await response.json();
//         renderTable(data);
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         alert("Failed to load data. Make sure you are logged in.");
//     }
// }

// function renderTable(apps) {
//     const tbody = document.getElementById('tableBody');
//     tbody.innerHTML = '';

//     if (apps.length === 0) {
//         tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 20px;">No applications found.</td></tr>';
//         return;
//     }

//     apps.forEach(app => {
//         const tr = document.createElement('tr');
//         const isChecked = app.status === 'checked';

//         if (isChecked) tr.classList.add('row-checked');

//         tr.innerHTML = `
//             <td>
//                 <span class="status-badge ${isChecked ? 'status-checked' : 'status-pending'}">
//                     ${app.status.toUpperCase()}
//                 </span>
//             </td>
//             <td>
//                 <div style="font-weight:bold;">${app.fullName}</div>
//                 <div style="font-size:0.8rem; color:#888;">${app.city}, ${app.age}yo</div>
//             </td>
//             <td>
//                 <div><a href="mailto:${app.email}" class="details-link">${app.email}</a></div>
//                 <div style="font-size:0.8rem; color:#888;">${app.phone}</div>
//             </td>
//             <td>
//                 <div style="color:var(--accent-cyan);">${app.primarySkillset}</div>
//                 <div style="font-size:0.8rem;">${app.educationStatus}</div>
//             </td>
//             <td>${app.yearsExperience} yrs</td>
//             <td>${new Date(app.createdAt).toLocaleDateString()}</td>
//             <td>
//                 <button class="action-btn check-btn" onclick="toggleStatus('${app._id}', '${app.status}')" title="Mark Checked/Pending">
//                     <i class="fas ${isChecked ? 'fa-undo' : 'fa-check'}"></i>
//                 </button>

//                 <button class="action-btn" style="background:rgba(0,210,255,0.1); color:#00d2ff;" onclick="allinfo('${app._id}')" title="View Details">
//                     <i class="fas fa-eye"></i>
//                 </button>

//                 <button class="action-btn delete-btn" onclick="deleteApp('${app._id}')" title="Delete">
//                     <i class="fas fa-trash"></i>
//                 </button>
//             </td>
//         `;
//         tbody.appendChild(tr);
//     });
// }

// async function toggleStatus(id, currentStatus) {
//     const newStatus = currentStatus === 'pending' ? 'checked' : 'pending';
//     try {
//         const res = await fetch(`/api/application/${id}/status`, {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ status: newStatus })
//         });

//         if (res.ok) {
//             fetchApplications();
//         }
//     } catch (err) {
//         alert('Error updating status');
//     }
// }

// function allinfo(id) {
//     window.location.href = `/api/application/allinfo/${id}`;
// }

// async function deleteApp(id) {
//     if (!confirm('Are you sure you want to permanently delete this application?')) return;

//     try {
//         const res = await fetch(`/api/application/${id}`, {
//             method: 'DELETE'
//         });

//         if (res.ok) {   
//             fetchApplications();
//         }
//     } catch (err) {
//         alert('Error deleting application');
//     }
// }document.addEventListener('DOMContentLoaded', init);

function init() {
    fetchApplications();
    fetchUsers();
}

function switchTab(tabName) {
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    if (tabName === 'apps') {
        document.getElementById('apps-section').classList.add('active');
        document.querySelector('.tab-btn:nth-child(1)').classList.add('active');
    } else {
        document.getElementById('users-section').classList.add('active');
        document.querySelector('.tab-btn:nth-child(2)').classList.add('active');
    }
}

async function fetchApplications() {
    try {
        const response = await fetch('/api/applications');
        const data = await response.json();
        renderTable(data);
    } catch (error) { console.error('Error fetching apps:', error); }
}

function renderTable(apps) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    if (apps.length === 0) { tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 20px;">No applications found.</td></tr>'; return; }

    apps.forEach(app => {
        const tr = document.createElement('tr');
        const isChecked = app.status === 'checked';
        if (isChecked) tr.classList.add('row-checked');

        tr.innerHTML = `
            <td><span class="status-badge ${isChecked ? 'status-checked' : 'status-pending'}">${app.status.toUpperCase()}</span></td>
            <td><div style="font-weight:bold;">${app.fullName}</div><div style="font-size:0.8rem; color:#888;">${app.city}, ${app.age}yo</div></td>
            <td><div><a href="mailto:${app.email}" style="color:#aaa;">${app.email}</a></div><div style="font-size:0.8rem; color:#888;">${app.phone}</div></td>
            <td><div style="color:var(--accent-cyan);">${app.primarySkillset}</div><div style="font-size:0.8rem;">${app.educationStatus}</div></td>
            <td>${app.yearsExperience} yrs</td>
            <td>${new Date(app.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="action-btn check-btn" onclick="toggleStatus('${app._id}', '${app.status}')"><i class="fas ${isChecked ? 'fa-undo' : 'fa-check'}"></i></button>
                <button class="action-btn" style="background:rgba(0,210,255,0.1); color:#00d2ff;" onclick="allinfo('${app._id}')"><i class="fas fa-eye"></i></button>
                <button class="action-btn delete-btn" onclick="deleteApp('${app._id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function fetchUsers() {
    try {
        const response = await fetch('/api/users');
        const data = await response.json();
        renderUsers(data);
    } catch (error) { console.error('Error fetching users:', error); }
}

function renderUsers(users) {
    const tbody = document.getElementById('usersBody');
    tbody.innerHTML = '';
    if (users.length === 0) { tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No users found.</td></tr>'; return; }

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight:bold; color:#fff;">${user.username}</td>
            <td>${user.email}</td>
            <td>${user.isAdmin ? '<span style="color:#00ff7f">Admin</span>' : '<span style="color:#888">User</span>'}</td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="action-btn" style="background:rgba(0,210,255,0.1); color:#00d2ff;" onclick="userInfo('${user._id}')"><i class="fas fa-eye"></i></button>
                <button class="action-btn delete-btn" onclick="deleteUser('${user._id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 'pending' ? 'checked' : 'pending';
    await fetch(`/api/application/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) });
    fetchApplications();
}

function allinfo(id) { window.location.href = `/api/application/allinfo/${id}`; }

function userInfo(id) { window.location.href = `/api/user/allinfo/${id}`; }

async function deleteApp(id) {
    if (!confirm('Delete this application?')) return;
    await fetch(`/api/application/${id}`, { method: 'DELETE' });
    fetchApplications();
}
async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user permanently?')) return;

    try {
        const res = await fetch(`/api/user/${id}`, { method: 'DELETE' });
        const data = await res.json();

        if (data.success) {
            fetchUsers();
        } else {
            alert('Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}