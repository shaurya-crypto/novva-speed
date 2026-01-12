// // // // let loadedApps = [];
// // // // let loadedUsers = [];
// // // // let loadedProjects = [];
// // // // let currentEditStatus = '';

// // // // function getAuthHeader() {
// // // //     const creds = sessionStorage.getItem('adminCreds');
// // // //     return creds ? 'Basic ' + creds : null;
// // // // }

// // // // function checkAuth() {
// // // //     if (!getAuthHeader()) {
// // // //         const username = prompt("Enter Admin Username:");
// // // //         const password = prompt("Enter Admin Password:");
// // // //         if (username && password) {
// // // //             sessionStorage.setItem('adminCreds', btoa(username + ':' + password));
// // // //             return true;
// // // //         } else {
// // // //             return false;
// // // //         }
// // // //     }
// // // //     return true;
// // // // }

// // // // function logout() {
// // // //     sessionStorage.removeItem('adminCreds');
// // // //     window.location.reload();
// // // // }

// // // // function init() {
// // // //     if (!checkAuth()) return;
// // // //     loadApps();
// // // //     loadUsers();
// // // //     loadProjects();
// // // // }

// // // // function switchTab(tabName) {
// // // //     document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
// // // //     document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
// // // //     document.getElementById(tabName + '-section').classList.add('active');

// // // //     const btns = document.querySelectorAll('.tab-btn');
// // // //     if (tabName === 'apps') btns[0].classList.add('active');
// // // //     if (tabName === 'users') btns[1].classList.add('active');
// // // //     if (tabName === 'projects') btns[2].classList.add('active');

// // // //     if (tabName === 'apps') loadApps();
// // // //     if (tabName === 'users') loadUsers();
// // // //     if (tabName === 'projects') loadProjects();
// // // // }

// // // // async function loadApps() {
// // // //     try {
// // // //         const res = await fetch('/api/applications', { headers: { 'Authorization': getAuthHeader() } });
// // // //         if (res.status === 401) { logout(); return; }
// // // //         loadedApps = await res.json();

// // // //         const tbody = document.getElementById('tableBody');
// // // //         tbody.innerHTML = '';

// // // //         loadedApps.forEach(app => {
// // // //             const statusColors = { 
// // // //                 'pending': '#ffa500', 
// // // //                 'reviewed': '#00fff2',
// // // //                 'approved': '#00ff00', 
// // // //                 'rejected': '#ff3333' 
// // // //             };

// // // //             let statusBtn = '';
// // // //             if (app.status === 'pending') {
// // // //                 statusBtn = `<button class="action-btn" onclick="toggleAppStatus('${app._id}', 'reviewed')" title="Mark Reviewed" style="color: #00ff00;"><i class="fas fa-check"></i></button>`;
// // // //             } else if (app.status === 'reviewed') {
// // // //                 statusBtn = `<button class="action-btn" onclick="toggleAppStatus('${app._id}', 'pending')" title="Undo Review" style="color: orange;"><i class="fas fa-undo"></i></button>`;
// // // //             } else {
// // // //                 statusBtn = `<button class="action-btn" onclick="toggleAppStatus('${app._id}', 'reviewed')" title="Mark Reviewed"><i class="fas fa-check"></i></button>`;
// // // //             }

// // // //             const row = `
// // // //                 <tr>
// // // //                     <td><span class="status-badge" style="background:${(statusColors[app.status] || '#fff')}20; color:${statusColors[app.status] || '#fff'}">${app.status.toUpperCase()}</span></td>
// // // //                     <td>${app.fullName}</td>
// // // //                     <td>${app.email}<br><small>${app.phone}</small></td>
// // // //                     <td>Talent</td>
// // // //                     <td>${app.yearsExperience || 'N/A'}</td>
// // // //                     <td>${new Date(app.createdAt).toLocaleDateString()}</td>
// // // //                     <td>
// // // //                         <button class="action-btn" onclick="viewDetails('app', '${app._id}')" title="View Details"><i class="fas fa-eye"></i></button>
// // // //                         ${statusBtn}
// // // //                         <button class="action-btn delete" onclick="deleteItem('/api/application/${app._id}', loadApps)" title="Delete"><i class="fas fa-trash"></i></button>
// // // //                     </td>
// // // //                 </tr>`;
// // // //             tbody.innerHTML += row;
// // // //         });
// // // //     } catch (err) { console.error(err); }
// // // // }

// // // // async function loadUsers() {
// // // //     try {
// // // //         const res = await fetch('/api/users', { headers: { 'Authorization': getAuthHeader() } });
// // // //         if (res.status === 401) return logout();
// // // //         loadedUsers = await res.json();

// // // //         const tbody = document.getElementById('usersBody');
// // // //         tbody.innerHTML = '';

// // // //         loadedUsers.forEach(user => {
// // // //             const displayRole = user.role === 'client'
// // // //                 ? '<span class="status-badge" style="background:rgba(255, 166, 0, 0.2); color: orange;">Client</span>'
// // // //                 : '<span class="status-badge" style="background:rgba(0, 255, 242, 0.1); color: var(--accent-cyan);">Work with Us</span>';

// // // //             const row = `
// // // //                 <tr>
// // // //                     <td>${user.username}</td>
// // // //                     <td>${user.email}</td>
// // // //                     <td>${displayRole}</td>
// // // //                     <td>${user.isAdmin ? 'Yes' : 'No'}</td>
// // // //                     <td>${new Date(user.createdAt).toLocaleDateString()}</td>
// // // //                     <td>
// // // //                         <button class="action-btn" onclick="viewDetails('user', '${user._id}')" title="View Details"><i class="fas fa-eye"></i></button>
// // // //                         <button class="action-btn delete" onclick="deleteItem('/api/user/${user._id}', loadUsers)" title="Delete"><i class="fas fa-trash"></i></button>
// // // //                     </td>
// // // //                 </tr>`;
// // // //             tbody.innerHTML += row;
// // // //         });
// // // //     } catch (err) { console.error(err); }
// // // // }

// // // // async function loadProjects() {
// // // //     try {
// // // //         const res = await fetch('/api/admin/projects', { headers: { 'Authorization': getAuthHeader() } });
// // // //         if (res.status === 401) return logout();
// // // //         if (!res.ok) return;
// // // //         loadedProjects = await res.json();

// // // //         const tbody = document.getElementById('projectsBody');
// // // //         tbody.innerHTML = '';

// // // //         loadedProjects.forEach(p => {
// // // //             let color = '#aaa';
// // // //             if (p.status === 'completed') color = '#00ff00';
// // // //             if (p.status === 'processing') color = '#00fff2';

// // // //             const row = `
// // // //                 <tr>
// // // //                     <td><span style="color:${color}; font-weight:bold; font-size:0.8rem;">${p.status.toUpperCase()}</span></td>
// // // //                     <td>${p.title}</td>
// // // //                     <td>${p.clientId || 'Guest Client'}</td>
// // // //                     <td>${p.assignedTeam || '<span style="color:#555">Unassigned</span>'}</td>
// // // //                     <td>${new Date(p.createdAt).toLocaleDateString()}</td>
// // // //                     <td class="action-cell">
// // // //                         <button class="action-btn" onclick="viewDetails('project', '${p._id}')" title="View Details"><i class="fas fa-eye"></i></button>
// // // //                         <button class="action-btn" onclick="editProject('${p._id}', '${p.assignedTeam || ''}', '${p.status}')" title="Edit"><i class="fas fa-pencil-alt"></i></button>
// // // //                         <button class="action-btn delete" onclick="deleteItem('/api/admin/project/${p._id}', loadProjects)" title="Delete"><i class="fas fa-trash"></i></button>
// // // //                     </td>
// // // //                 </tr>`;
// // // //             tbody.innerHTML += row;
// // // //         });
// // // //     } catch (err) { console.error(err); }
// // // // }

// // // // function viewDetails(type, id) {
// // // //     let data = null;
// // // //     let title = "Details";

// // // //     if (type === 'app') {
// // // //         data = loadedApps.find(x => x._id === id);
// // // //         title = "Application Details";
// // // //     } else if (type === 'user') {
// // // //         data = loadedUsers.find(x => x._id === id);
// // // //         title = "User Profile";
// // // //     } else if (type === 'project') {
// // // //         data = loadedProjects.find(x => x._id === id);
// // // //         title = "Project Manifest";
// // // //     }

// // // //     if (!data) return alert("Data not found");

// // // //     const newWin = window.open('', '_blank');
// // // //     let htmlContent = '';

// // // //     for (const [key, value] of Object.entries(data)) {
// // // //         if (key === '__v' || key === 'password' || key === '_id' || key === 'updatedAt') continue;

// // // //         let displayValue = value;
// // // //         let displayKey = key.replace(/([A-Z])/g, ' $1').trim().toUpperCase();

// // // //         if (key.toLowerCase().includes('date') || key === 'createdAt') {
// // // //             displayValue = new Date(value).toLocaleString();
// // // //         }

// // // //         if (key === 'motive') {
// // // //             displayKey = "MEMBERSHIP TYPE";
// // // //             if (value === 'learning') {
// // // //                 displayValue = '<strong style="color: #00ff00;">New Member (Joining)</strong>';
// // // //             } else if (value === 'projects') {
// // // //                 displayValue = '<strong style="color: #00fff2;">Old Member (Existing)</strong>';
// // // //             }
// // // //         }

// // // //         if (key === 'department' && value) {
// // // //             displayValue = value.charAt(0).toUpperCase() + value.slice(1);
// // // //         }

// // // //         if (!displayValue && displayValue !== 0) displayValue = '<span style="color:#555">N/A</span>';

// // // //         htmlContent += `
// // // //             <div class="item">
// // // //                 <div class="label">${displayKey}</div>
// // // //                 <div class="value">${displayValue}</div>
// // // //             </div>
// // // //         `;
// // // //     }

// // // //     newWin.document.write(`
// // // //         <html>
// // // //             <head>
// // // //                 <title>${title} | Novaa Admin</title>
// // // //                 <style>
// // // //                     body { background-color: #0a0a0a; color: #fff; font-family: 'Segoe UI', sans-serif; padding: 40px; }
// // // //                     h2 { color: #00fff2; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 30px; }
// // // //                     .item { margin-bottom: 20px; background: #111; padding: 15px; border-radius: 8px; border: 1px solid #222; }
// // // //                     .label { color: #00fff2; font-size: 0.8rem; margin-bottom: 5px; opacity: 0.8; }
// // // //                     .value { font-size: 1.1rem; word-wrap: break-word; }
// // // //                 </style>
// // // //             </head>
// // // //             <body>
// // // //                 <h2>${title}</h2>
// // // //                 ${htmlContent}
// // // //             </body>
// // // //         </html>
// // // //     `);
// // // //     newWin.document.close();
// // // // }

// // // // async function toggleAppStatus(id, newStatus) {
// // // //     try {
// // // //         await fetch(`/api/application/${id}/status`, {
// // // //             method: 'PATCH',
// // // //             headers: {
// // // //                 'Content-Type': 'application/json',
// // // //                 'Authorization': getAuthHeader()
// // // //             },
// // // //             body: JSON.stringify({ status: newStatus })
// // // //         });
// // // //         loadApps();
// // // //     } catch(err) {
// // // //         console.error(err);
// // // //         alert("Failed to update status");
// // // //     }
// // // // }

// // // // function editProject(id, team, status) {
// // // //     document.getElementById('editProjectId').value = id;
// // // //     document.getElementById('teamInput').value = team;
// // // //     document.getElementById('projectModal').style.display = 'flex';
// // // //     setProjectStatus(status);
// // // // }

// // // // function setProjectStatus(status) {
// // // //     currentEditStatus = status;
// // // //     document.querySelectorAll('.status-option').forEach(btn => {
// // // //         btn.classList.remove('active');
// // // //         if (btn.innerText.toLowerCase().replace(' ', '_').includes(status.split('_')[0])) {
// // // //             btn.classList.add('active');
// // // //         }
// // // //     });
// // // // }

// // // // async function saveProjectChanges() {
// // // //     const id = document.getElementById('editProjectId').value;
// // // //     const team = document.getElementById('teamInput').value;

// // // //     await fetch(`/api/admin/project/${id}`, {
// // // //         method: 'PATCH',
// // // //         headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
// // // //         body: JSON.stringify({ assignedTeam: team, status: currentEditStatus })
// // // //     });

// // // //     closeModal('projectModal');
// // // //     loadProjects();
// // // // }

// // // // function closeModal(modalId) {
// // // //     document.getElementById(modalId).style.display = 'none';
// // // // }

// // // // function deleteItem(url, reloadCallback) {
// // // //     if (confirm('Are you sure you want to permanently delete this?')) {
// // // //         fetch(url, { method: 'DELETE', headers: { 'Authorization': getAuthHeader() } })
// // // //             .then(() => reloadCallback());
// // // //     }
// // // // }

// // // // window.onload = init;

// // // let loadedApps = [];
// // // let loadedUsers = [];
// // // let loadedProjects = [];
// // // let currentEditStatus = '';

// // // function getAuthHeader() {
// // //     const creds = sessionStorage.getItem('adminCreds');
// // //     return creds ? 'Basic ' + creds : null;
// // // }

// // // function checkAuth() {
// // //     if (!getAuthHeader()) {
// // //         const username = prompt("Enter Admin Username:");
// // //         const password = prompt("Enter Admin Password:");
// // //         if (username && password) {
// // //             sessionStorage.setItem('adminCreds', btoa(username + ':' + password));
// // //             return true;
// // //         } else {
// // //             return false;
// // //         }
// // //     }
// // //     return true;
// // // }

// // // function logout() {
// // //     sessionStorage.removeItem('adminCreds');
// // //     window.location.reload();
// // // }

// // // function init() {
// // //     if (!checkAuth()) return;
// // //     loadApps();
// // //     loadUsers();
// // //     loadProjects();
// // // }

// // // function switchTab(tabName) {
// // //     document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
// // //     document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
// // //     document.getElementById(tabName + '-section').classList.add('active');

// // //     const btns = document.querySelectorAll('.tab-btn');
// // //     if (tabName === 'apps') btns[0].classList.add('active');
// // //     if (tabName === 'users') btns[1].classList.add('active');
// // //     if (tabName === 'projects') btns[2].classList.add('active');

// // //     if (tabName === 'apps') loadApps();
// // //     if (tabName === 'users') loadUsers();
// // //     if (tabName === 'projects') loadProjects();
// // // }

// // // async function loadApps() {
// // //     try {
// // //         const res = await fetch('/api/applications', { headers: { 'Authorization': getAuthHeader() } });
// // //         if (res.status === 401) { logout(); return; }
// // //         loadedApps = await res.json();

// // //         const tbody = document.getElementById('tableBody');
// // //         tbody.innerHTML = '';

// // //         loadedApps.forEach(app => {
// // //             const statusColors = {
// // //                 'pending': '#ffa500',
// // //                 'reviewed': '#00fff2',
// // //                 'approved': '#00ff00',
// // //                 'rejected': '#ff3333'
// // //             };

// // //             let statusBtn = '';
// // //             if (app.status === 'pending') {
// // //                 statusBtn = `<button class="action-btn" onclick="toggleAppStatus('${app._id}', 'reviewed')" title="Mark Reviewed" style="color: #00ff00;"><i class="fas fa-check"></i></button>`;
// // //             } else if (app.status === 'reviewed') {
// // //                 statusBtn = `<button class="action-btn" onclick="toggleAppStatus('${app._id}', 'pending')" title="Undo Review" style="color: orange;"><i class="fas fa-undo"></i></button>`;
// // //             } else {
// // //                 statusBtn = `<button class="action-btn" onclick="toggleAppStatus('${app._id}', 'reviewed')" title="Mark Reviewed"><i class="fas fa-check"></i></button>`;
// // //             }

// // //             const row = `
// // //                 <tr>
// // //                     <td><span class="status-badge" style="background:${(statusColors[app.status] || '#fff')}20; color:${statusColors[app.status] || '#fff'}">${app.status.toUpperCase()}</span></td>
// // //                     <td>${app.fullName}</td>
// // //                     <td>${app.email}<br><small>${app.phone}</small></td>
// // //                     <td>Talent</td>
// // //                     <td>${app.yearsExperience || 'N/A'}</td>
// // //                     <td>${new Date(app.createdAt).toLocaleDateString()}</td>
// // //                     <td>
// // //                         <button class="action-btn" onclick="viewDetails('app', '${app._id}')" title="View Details"><i class="fas fa-eye"></i></button>
// // //                         <button class="action-btn" onclick="openAppEditModal('${app._id}')" title="Edit ID Card"><i class="fas fa-pencil-alt"></i></button>
// // //                         ${statusBtn}
// // //                         <button class="action-btn delete" onclick="deleteItem('/api/application/${app._id}', loadApps)" title="Delete"><i class="fas fa-trash"></i></button>
// // //                     </td>
// // //                 </tr>`;
// // //             tbody.innerHTML += row;
// // //         });
// // //     } catch (err) { console.error(err); }
// // // }

// // // async function loadUsers() {
// // //     try {
// // //         const res = await fetch('/api/users', { headers: { 'Authorization': getAuthHeader() } });
// // //         if (res.status === 401) return logout();
// // //         loadedUsers = await res.json();

// // //         const tbody = document.getElementById('usersBody');
// // //         tbody.innerHTML = '';

// // //         loadedUsers.forEach(user => {
// // //             const displayRole = user.role === 'client'
// // //                 ? '<span class="status-badge" style="background:rgba(255, 166, 0, 0.2); color: orange;">Client</span>'
// // //                 : '<span class="status-badge" style="background:rgba(0, 255, 242, 0.1); color: var(--accent-cyan);">Work with Us</span>';

// // //             const row = `
// // //                 <tr>
// // //                     <td>${user.username}</td>
// // //                     <td>${user.email}</td>
// // //                     <td>${displayRole}</td>
// // //                     <td>${user.isAdmin ? 'Yes' : 'No'}</td>
// // //                     <td>${new Date(user.createdAt).toLocaleDateString()}</td>
// // //                     <td>
// // //                         <button class="action-btn" onclick="viewDetails('user', '${user._id}')" title="View Details"><i class="fas fa-eye"></i></button>
// // //                         <button class="action-btn delete" onclick="deleteItem('/api/user/${user._id}', loadUsers)" title="Delete"><i class="fas fa-trash"></i></button>
// // //                     </td>
// // //                 </tr>`;
// // //             tbody.innerHTML += row;
// // //         });
// // //     } catch (err) { console.error(err); }
// // // }

// // // async function loadProjects() {
// // //     try {
// // //         const res = await fetch('/api/admin/projects', { headers: { 'Authorization': getAuthHeader() } });
// // //         if (res.status === 401) return logout();
// // //         if (!res.ok) return;
// // //         loadedProjects = await res.json();

// // //         const tbody = document.getElementById('projectsBody');
// // //         tbody.innerHTML = '';

// // //         loadedProjects.forEach(p => {
// // //             let color = '#aaa';
// // //             if (p.status === 'completed') color = '#00ff00';
// // //             if (p.status === 'processing') color = '#00fff2';

// // //             const row = `
// // //                 <tr>
// // //                     <td><span style="color:${color}; font-weight:bold; font-size:0.8rem;">${p.status.toUpperCase()}</span></td>
// // //                     <td>${p.title}</td>
// // //                     <td>${p.clientId || 'Guest Client'}</td>
// // //                     <td>${p.assignedTeam || '<span style="color:#555">Unassigned</span>'}</td>
// // //                     <td>${new Date(p.createdAt).toLocaleDateString()}</td>
// // //                     <td class="action-cell">
// // //                         <button class="action-btn" onclick="viewDetails('project', '${p._id}')" title="View Details"><i class="fas fa-eye"></i></button>
// // //                         <button class="action-btn" onclick="editProject('${p._id}', '${p.assignedTeam || ''}', '${p.status}')" title="Edit"><i class="fas fa-pencil-alt"></i></button>
// // //                         <button class="action-btn delete" onclick="deleteItem('/api/admin/project/${p._id}', loadProjects)" title="Delete"><i class="fas fa-trash"></i></button>
// // //                     </td>
// // //                 </tr>`;
// // //             tbody.innerHTML += row;
// // //         });
// // //     } catch (err) { console.error(err); }
// // // }

// // // function viewDetails(type, id) {
// // //     let data = null;
// // //     let title = "Details";

// // //     if (type === 'app') {
// // //         data = loadedApps.find(x => x._id === id);
// // //         title = "Application Details";
// // //     } else if (type === 'user') {
// // //         data = loadedUsers.find(x => x._id === id);
// // //         title = "User Profile";
// // //     } else if (type === 'project') {
// // //         data = loadedProjects.find(x => x._id === id);
// // //         title = "Project Manifest";
// // //     }

// // //     if (!data) return alert("Data not found");

// // //     const newWin = window.open('', '_blank');
// // //     let htmlContent = '';

// // //     for (const [key, value] of Object.entries(data)) {
// // //         if (key === '__v' || key === 'password' || key === '_id' || key === 'updatedAt') continue;

// // //         let displayValue = value;
// // //         let displayKey = key.replace(/([A-Z])/g, ' $1').trim().toUpperCase();

// // //         if (key.toLowerCase().includes('date') || key === 'createdAt') {
// // //             displayValue = new Date(value).toLocaleString();
// // //         }

// // //         if (key === 'motive') {
// // //             displayKey = "MEMBERSHIP TYPE";
// // //             if (value === 'learning') {
// // //                 displayValue = '<strong style="color: #00ff00;">New Member (Joining)</strong>';
// // //             } else if (value === 'projects') {
// // //                 displayValue = '<strong style="color: #00fff2;">Old Member (Existing)</strong>';
// // //             }
// // //         }

// // //         if (key === 'department' && value) {
// // //             displayValue = value.charAt(0).toUpperCase() + value.slice(1);
// // //         }

// // //         if (!displayValue && displayValue !== 0) displayValue = '<span style="color:#555">N/A</span>';

// // //         htmlContent += `
// // //             <div class="item">
// // //                 <div class="label">${displayKey}</div>
// // //                 <div class="value">${displayValue}</div>
// // //             </div>
// // //         `;
// // //     }

// // //     newWin.document.write(`
// // //         <html>
// // //             <head>
// // //                 <title>${title} | Novaa Admin</title>
// // //                 <style>
// // //                     body { background-color: #0a0a0a; color: #fff; font-family: 'Segoe UI', sans-serif; padding: 40px; }
// // //                     h2 { color: #00fff2; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 30px; }
// // //                     .item { margin-bottom: 20px; background: #111; padding: 15px; border-radius: 8px; border: 1px solid #222; }
// // //                     .label { color: #00fff2; font-size: 0.8rem; margin-bottom: 5px; opacity: 0.8; }
// // //                     .value { font-size: 1.1rem; word-wrap: break-word; }
// // //                 </style>
// // //             </head>
// // //             <body>
// // //                 <h2>${title}</h2>
// // //                 ${htmlContent}
// // //             </body>
// // //         </html>
// // //     `);
// // //     newWin.document.close();
// // // }

// // // async function toggleAppStatus(id, newStatus) {
// // //     try {
// // //         await fetch(`/api/application/${id}/status`, {
// // //             method: 'PATCH',
// // //             headers: {
// // //                 'Content-Type': 'application/json',
// // //                 'Authorization': getAuthHeader()
// // //             },
// // //             body: JSON.stringify({ status: newStatus })
// // //         });
// // //         loadApps();
// // //     } catch (err) {
// // //         console.error(err);
// // //         alert("Failed to update status");
// // //     }
// // // }

// // // function openAppEditModal(id) {
// // //     const app = loadedApps.find(x => x._id === id);
// // //     document.getElementById('editAppId').value = id;

// // //     document.getElementById('adminUserRole').value = app.assignedRole || '';
// // //     document.getElementById('adminUserTeam').value = app.assignedTeam || '';
// // //     document.getElementById('adminUserPost').value = app.assignedPost || '';
// // //     document.getElementById('adminUserUpdate').value = app.adminMessage || '';
// // //     document.getElementById('adminUserWork').value = app.assignedWork || '';

// // //     document.getElementById('appEditModal').style.display = 'flex';
// // // }

// // // async function saveAppCardDetails() {
// // //     const id = document.getElementById('editAppId').value;
// // //     const payload = {
// // //         assignedRole: document.getElementById('adminUserRole').value,
// // //         assignedTeam: document.getElementById('adminUserTeam').value,
// // //         assignedPost: document.getElementById('adminUserPost').value,
// // //         adminMessage: document.getElementById('adminUserUpdate').value,
// // //         assignedWork: document.getElementById('adminUserWork').value
// // //     };

// // //     try {
// // //         await fetch(`/api/application/${id}/admin-update`, {
// // //             method: 'PATCH',
// // //             headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
// // //             body: JSON.stringify(payload)
// // //         });
// // //         closeModal('appEditModal');
// // //         loadApps();
// // //     } catch (err) {
// // //         console.error(err);
// // //         alert("Failed to save ID Card details");
// // //     }
// // // }

// // // function editProject(id, team, status) {
// // //     document.getElementById('editProjectId').value = id;
// // //     document.getElementById('teamInput').value = team;
// // //     document.getElementById('projectModal').style.display = 'flex';
// // //     setProjectStatus(status);
// // // }

// // // function setProjectStatus(status) {
// // //     currentEditStatus = status;
// // //     document.querySelectorAll('.status-option').forEach(btn => {
// // //         btn.classList.remove('active');
// // //         if (btn.innerText.toLowerCase().replace(' ', '_').includes(status.split('_')[0])) {
// // //             btn.classList.add('active');
// // //         }
// // //     });
// // // }

// // // async function saveProjectChanges() {
// // //     const id = document.getElementById('editProjectId').value;
// // //     const team = document.getElementById('teamInput').value;

// // //     await fetch(`/api/admin/project/${id}`, {
// // //         method: 'PATCH',
// // //         headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
// // //         body: JSON.stringify({ assignedTeam: team, status: currentEditStatus })
// // //     });

// // //     closeModal('projectModal');
// // //     loadProjects();
// // // }

// // // function closeModal(modalId) {
// // //     document.getElementById(modalId).style.display = 'none';
// // // }

// // // function deleteItem(url, reloadCallback) {
// // //     if (confirm('Are you sure you want to permanently delete this?')) {
// // //         fetch(url, { method: 'DELETE', headers: { 'Authorization': getAuthHeader() } })
// // //             .then(() => reloadCallback());
// // //     }
// // // }

// // // window.onload = init;

// // let loadedApps = [];
// // let loadedUsers = [];
// // let loadedProjects = [];
// // let currentEditStatus = '';

// // function getAuthHeader() {
// //     const creds = sessionStorage.getItem('adminCreds');
// //     return creds ? 'Basic ' + creds : null;
// // }

// // function checkAuth() {
// //     if (!getAuthHeader()) {
// //         const username = prompt("Enter Admin Username:");
// //         const password = prompt("Enter Admin Password:");
// //         if (username && password) {
// //             sessionStorage.setItem('adminCreds', btoa(username + ':' + password));
// //             return true;
// //         } else {
// //             return false;
// //         }
// //     }
// //     return true;
// // }

// // function logout() {
// //     sessionStorage.removeItem('adminCreds');
// //     window.location.reload();
// // }

// // function init() {
// //     if (!checkAuth()) return;
// //     loadApps();
// //     loadUsers();
// //     loadProjects();
// // }

// // function switchTab(tabName) {
// //     document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
// //     document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
// //     document.getElementById(tabName + '-section').classList.add('active');

// //     const btns = document.querySelectorAll('.tab-btn');
// //     if (tabName === 'apps') btns[0].classList.add('active');
// //     if (tabName === 'users') btns[1].classList.add('active');
// //     if (tabName === 'projects') btns[2].classList.add('active');

// //     if (tabName === 'apps') loadApps();
// //     if (tabName === 'users') loadUsers();
// //     if (tabName === 'projects') loadProjects();
// // }

// // async function loadApps() {
// //     try {
// //         const res = await fetch('/api/applications', { headers: { 'Authorization': getAuthHeader() } });
// //         if (res.status === 401) { logout(); return; }
// //         loadedApps = await res.json();

// //         const tbody = document.getElementById('tableBody');
// //         tbody.innerHTML = '';

// //         loadedApps.forEach(app => {
// //             const statusColors = {
// //                 'pending': '#ffa500',
// //                 'reviewed': '#00fff2',
// //                 'approved': '#00ff00',
// //                 'rejected': '#ff3333'
// //             };

// //             let statusBtn = '';
// //             if (app.status === 'pending') {
// //                 statusBtn = `<button class="action-btn" onclick="toggleAppStatus('${app._id}', 'reviewed')" title="Mark Reviewed" style="color: #00ff00;"><i class="fas fa-check"></i></button>`;
// //             } else if (app.status === 'reviewed') {
// //                 statusBtn = `<button class="action-btn" onclick="toggleAppStatus('${app._id}', 'pending')" title="Undo Review" style="color: orange;"><i class="fas fa-undo"></i></button>`;
// //             } else {
// //                 statusBtn = `<button class="action-btn" onclick="toggleAppStatus('${app._id}', 'reviewed')" title="Mark Reviewed"><i class="fas fa-check"></i></button>`;
// //             }

// //             const row = `
// //                 <tr>
// //                     <td><span class="status-badge" style="background:${(statusColors[app.status] || '#fff')}20; color:${statusColors[app.status] || '#fff'}">${app.status.toUpperCase()}</span></td>
// //                     <td>${app.fullName}</td>
// //                     <td>${app.email}<br><small>${app.phone}</small></td>
// //                     <td>Talent</td>
// //                     <td>${app.yearsExperience || 'N/A'}</td>
// //                     <td>${new Date(app.createdAt).toLocaleDateString()}</td>
// //                     <td>
// //                         <button class="action-btn" onclick="viewDetails('app', '${app._id}')" title="View Details"><i class="fas fa-eye"></i></button>
// //                         <button class="action-btn" onclick="openIdCardModal('${app._id}')" title="Edit ID Card"><i class="fas fa-pencil-alt"></i></button>
// //                         ${statusBtn}
// //                         <button class="action-btn delete" onclick="deleteItem('/api/application/${app._id}', loadApps)" title="Delete"><i class="fas fa-trash"></i></button>
// //                     </td>
// //                 </tr>`;
// //             tbody.innerHTML += row;
// //         });
// //     } catch (err) { console.error(err); }
// // }

// // async function loadUsers() {
// //     try {
// //         const res = await fetch('/api/users', { headers: { 'Authorization': getAuthHeader() } });
// //         if (res.status === 401) return logout();
// //         loadedUsers = await res.json();

// //         const tbody = document.getElementById('usersBody');
// //         tbody.innerHTML = '';

// //         loadedUsers.forEach(user => {
// //             const displayRole = user.role === 'client'
// //                 ? '<span class="status-badge" style="background:rgba(255, 166, 0, 0.2); color: orange;">Client</span>'
// //                 : '<span class="status-badge" style="background:rgba(0, 255, 242, 0.1); color: var(--accent-cyan);">Work with Us</span>';

// //             const row = `
// //                 <tr>
// //                     <td>${user.username}</td>
// //                     <td>${user.email}</td>
// //                     <td>${displayRole}</td>
// //                     <td>${user.isAdmin ? 'Yes' : 'No'}</td>
// //                     <td>${new Date(user.createdAt).toLocaleDateString()}</td>
// //                     <td>
// //                         <button class="action-btn" onclick="viewDetails('user', '${user._id}')" title="View Details"><i class="fas fa-eye"></i></button>
// //                         <button class="action-btn delete" onclick="deleteItem('/api/user/${user._id}', loadUsers)" title="Delete"><i class="fas fa-trash"></i></button>
// //                     </td>
// //                 </tr>`;
// //             tbody.innerHTML += row;
// //         });
// //     } catch (err) { console.error(err); }
// // }

// // async function loadProjects() {
// //     try {
// //         const res = await fetch('/api/admin/projects', { headers: { 'Authorization': getAuthHeader() } });
// //         if (res.status === 401) return logout();
// //         if (!res.ok) return;
// //         loadedProjects = await res.json();

// //         const tbody = document.getElementById('projectsBody');
// //         tbody.innerHTML = '';

// //         loadedProjects.forEach(p => {
// //             let color = '#aaa';
// //             if (p.status === 'completed') color = '#00ff00';
// //             if (p.status === 'processing') color = '#00fff2';

// //             const row = `
// //                 <tr>
// //                     <td><span style="color:${color}; font-weight:bold; font-size:0.8rem;">${p.status.toUpperCase()}</span></td>
// //                     <td>${p.title}</td>
// //                     <td>${p.clientId || 'Guest Client'}</td>
// //                     <td>${p.assignedTeam || '<span style="color:#555">Unassigned</span>'}</td>
// //                     <td>${new Date(p.createdAt).toLocaleDateString()}</td>
// //                     <td class="action-cell">
// //                         <button class="action-btn" onclick="viewDetails('project', '${p._id}')" title="View Details"><i class="fas fa-eye"></i></button>
// //                         <button class="action-btn" onclick="editProject('${p._id}', '${p.assignedTeam || ''}', '${p.status}')" title="Edit"><i class="fas fa-pencil-alt"></i></button>
// //                         <button class="action-btn delete" onclick="deleteItem('/api/admin/project/${p._id}', loadProjects)" title="Delete"><i class="fas fa-trash"></i></button>
// //                     </td>
// //                 </tr>`;
// //             tbody.innerHTML += row;
// //         });
// //     } catch (err) { console.error(err); }
// // }

// // function viewDetails(type, id) {
// //     let data = null;
// //     let title = "Details";

// //     if (type === 'app') {
// //         data = loadedApps.find(x => x._id === id);
// //         title = "Application Details";
// //     } else if (type === 'user') {
// //         data = loadedUsers.find(x => x._id === id);
// //         title = "User Profile";
// //     } else if (type === 'project') {
// //         data = loadedProjects.find(x => x._id === id);
// //         title = "Project Manifest";
// //     }

// //     if (!data) return alert("Data not found");

// //     const newWin = window.open('', '_blank');
// //     let htmlContent = '';

// //     for (const [key, value] of Object.entries(data)) {
// //         if (key === '__v' || key === 'password' || key === '_id' || key === 'updatedAt') continue;

// //         let displayValue = value;
// //         let displayKey = key.replace(/([A-Z])/g, ' $1').trim().toUpperCase();

// //         if (key.toLowerCase().includes('date') || key === 'createdAt') {
// //             displayValue = new Date(value).toLocaleString();
// //         }

// //         if (key === 'motive') {
// //             displayKey = "MEMBERSHIP TYPE";
// //             if (value === 'learning') {
// //                 displayValue = '<strong style="color: #00ff00;">New Member (Joining)</strong>';
// //             } else if (value === 'projects') {
// //                 displayValue = '<strong style="color: #00fff2;">Old Member (Existing)</strong>';
// //             }
// //         }

// //         if (key === 'department' && value) {
// //             displayValue = value.charAt(0).toUpperCase() + value.slice(1);
// //         }

// //         if (!displayValue && displayValue !== 0) displayValue = '<span style="color:#555">N/A</span>';

// //         htmlContent += `
// //             <div class="item">
// //                 <div class="label">${displayKey}</div>
// //                 <div class="value">${displayValue}</div>
// //             </div>
// //         `;
// //     }

// //     newWin.document.write(`
// //         <html>
// //             <head>
// //                 <title>${title} | Novaa Admin</title>
// //                 <style>
// //                     body { background-color: #0a0a0a; color: #fff; font-family: 'Segoe UI', sans-serif; padding: 40px; }
// //                     h2 { color: #00fff2; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 30px; }
// //                     .item { margin-bottom: 20px; background: #111; padding: 15px; border-radius: 8px; border: 1px solid #222; }
// //                     .label { color: #00fff2; font-size: 0.8rem; margin-bottom: 5px; opacity: 0.8; }
// //                     .value { font-size: 1.1rem; word-wrap: break-word; }
// //                 </style>
// //             </head>
// //             <body>
// //                 <h2>${title}</h2>
// //                 ${htmlContent}
// //             </body>
// //         </html>
// //     `);
// //     newWin.document.close();
// // }

// // async function toggleAppStatus(id, newStatus) {
// //     try {
// //         await fetch(`/api/application/${id}/status`, {
// //             method: 'PATCH',
// //             headers: {
// //                 'Content-Type': 'application/json',
// //                 'Authorization': getAuthHeader()
// //             },
// //             body: JSON.stringify({ status: newStatus })
// //         });
// //         loadApps();
// //     } catch (err) {
// //         console.error(err);
// //         alert("Failed to update status");
// //     }
// // }

// // function openIdCardModal(id) {
// //     const app = loadedApps.find(x => x._id === id);
// //     if (!app) return;

// //     document.getElementById('editAppId').value = id;

// //     document.getElementById('cardRoleInput').value = app.assignedRole || '';
// //     document.getElementById('cardTeamInput').value = app.assignedTeam || '';
// //     document.getElementById('cardPostInput').value = app.assignedPost || '';
// //     document.getElementById('cardMessageInput').value = app.adminMessage || '';
// //     document.getElementById('cardWorkInput').value = app.assignedWork || '';

// //     document.getElementById('idCardModal').style.display = 'flex';
// // }

// // async function saveIdCardDetails() {
// //     const id = document.getElementById('editAppId').value;
// //     const payload = {
// //         assignedRole: document.getElementById('cardRoleInput').value,
// //         assignedTeam: document.getElementById('cardTeamInput').value,
// //         assignedPost: document.getElementById('cardPostInput').value,
// //         adminMessage: document.getElementById('cardMessageInput').value,
// //         assignedWork: document.getElementById('cardWorkInput').value
// //     };

// //     try {
// //         await fetch(`/api/application/${id}/card-details`, {
// //             method: 'PATCH',
// //             headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
// //             body: JSON.stringify(payload)
// //         });
// //         closeModal('idCardModal');
// //         loadApps();
// //     } catch (err) {
// //         console.error(err);
// //         alert("Failed to save ID Card details");
// //     }
// // }

// // function editProject(id, team, status) {
// //     document.getElementById('editProjectId').value = id;
// //     document.getElementById('teamInput').value = team;
// //     document.getElementById('projectModal').style.display = 'flex';
// //     setProjectStatus(status);
// // }

// // function setProjectStatus(status) {
// //     currentEditStatus = status;
// //     document.querySelectorAll('.status-option').forEach(btn => {
// //         btn.classList.remove('active');
// //         if (btn.innerText.toLowerCase().replace(' ', '_').includes(status.split('_')[0])) {
// //             btn.classList.add('active');
// //         }
// //     });
// // }

// // async function saveProjectChanges() {
// //     const id = document.getElementById('editProjectId').value;
// //     const team = document.getElementById('teamInput').value;

// //     await fetch(`/api/admin/project/${id}`, {
// //         method: 'PATCH',
// //         headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
// //         body: JSON.stringify({ assignedTeam: team, status: currentEditStatus })
// //     });

// //     closeModal('projectModal');
// //     loadProjects();
// // }

// // function closeModal(modalId) {
// //     document.getElementById(modalId).style.display = 'none';
// // }

// // function deleteItem(url, reloadCallback) {
// //     if (confirm('Are you sure you want to permanently delete this?')) {
// //         fetch(url, { method: 'DELETE', headers: { 'Authorization': getAuthHeader() } })
// //             .then(() => reloadCallback());
// //     }
// // }

// // window.onload = init;

// let loadedApps = [];
// let loadedUsers = [];
// let loadedProjects = [];
// let currentEditStatus = '';

// function getAuthHeader() {
//     const creds = sessionStorage.getItem('adminCreds');
//     return creds ? 'Basic ' + creds : null;
// }

// function checkAuth() {
//     if (!getAuthHeader()) {
//         const username = prompt("Enter Admin Username:");
//         const password = prompt("Enter Admin Password:");
//         if (username && password) {
//             sessionStorage.setItem('adminCreds', btoa(username + ':' + password));
//             return true;
//         } else {
//             return false;
//         }
//     }
//     return true;
// }

// function logout() {
//     sessionStorage.removeItem('adminCreds');
//     window.location.reload();
// }

// function init() {
//     if (!checkAuth()) return;
//     loadApps();
//     loadUsers();
//     loadProjects();
// }

// function switchTab(tabName) {
//     document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
//     document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
//     document.getElementById(tabName + '-section').classList.add('active');

//     const btns = document.querySelectorAll('.tab-btn');
//     if (tabName === 'apps') btns[0].classList.add('active');
//     if (tabName === 'users') btns[1].classList.add('active');
//     if (tabName === 'projects') btns[2].classList.add('active');

//     if (tabName === 'apps') loadApps();
//     if (tabName === 'users') loadUsers();
//     if (tabName === 'projects') loadProjects();
// }

// async function loadApps() {
//     try {
//         const res = await fetch('/api/applications', { headers: { 'Authorization': getAuthHeader() } });
//         if (res.status === 401) { logout(); return; }
//         loadedApps = await res.json();

//         const tbody = document.getElementById('tableBody');
//         tbody.innerHTML = '';

//         loadedApps.forEach(app => {
//             const statusColors = {
//                 'pending': '#ffa500',
//                 'reviewed': '#00fff2',
//                 'approved': '#00ff00',
//                 'rejected': '#ff3333'
//             };

//             // Safety check for status
//             const currentStatus = app.status || 'pending';

//             let statusBtn = '';
//             if (currentStatus === 'pending') {
//                 statusBtn = `<button class="action-btn" onclick="toggleAppStatus('${app._id}', 'reviewed')" title="Mark Reviewed" style="color: #00ff00;"><i class="fas fa-check"></i></button>`;
//             } else if (currentStatus === 'reviewed') {
//                 statusBtn = `<button class="action-btn" onclick="toggleAppStatus('${app._id}', 'pending')" title="Undo Review" style="color: orange;"><i class="fas fa-undo"></i></button>`;
//             } else {
//                 statusBtn = `<button class="action-btn" onclick="toggleAppStatus('${app._id}', 'reviewed')" title="Mark Reviewed"><i class="fas fa-check"></i></button>`;
//             }

//             const row = `
//                 <tr>
//                     <td><span class="status-badge" style="background:${(statusColors[currentStatus] || '#fff')}20; color:${statusColors[currentStatus] || '#fff'}">${currentStatus.toUpperCase()}</span></td>
//                     <td>${app.fullName}</td>
//                     <td>${app.email}<br><small>${app.phone}</small></td>
//                     <td>${app.primarySkillset || app.department || 'N/A'}</td>
//                     <td>${app.educationStatus || 'N/A'}</td>
//                     <td>${new Date(app.createdAt).toLocaleDateString()}</td>
//                     <td>
//                         <button class="action-btn" onclick="viewDetails('app', '${app._id}')" title="View Details"><i class="fas fa-eye"></i></button>
//                         <button class="action-btn" onclick="openIdCardModal('${app._id}')" title="Edit ID Card"><i class="fas fa-pencil-alt"></i></button>
//                         ${statusBtn}
//                         <button class="action-btn delete" onclick="deleteItem('/api/application/${app._id}', loadApps)" title="Delete"><i class="fas fa-trash"></i></button>
//                     </td>
//                 </tr>`;
//             tbody.innerHTML += row;
//         });
//     } catch (err) { console.error(err); }
// }

// async function loadUsers() {
//     try {
//         const res = await fetch('/api/users', { headers: { 'Authorization': getAuthHeader() } });
//         if (res.status === 401) return logout();
//         loadedUsers = await res.json();

//         const tbody = document.getElementById('usersBody');
//         tbody.innerHTML = '';

//         loadedUsers.forEach(user => {
//             const displayRole = user.role === 'client'
//                 ? '<span class="status-badge" style="background:rgba(255, 166, 0, 0.2); color: orange;">Client</span>'
//                 : '<span class="status-badge" style="background:rgba(0, 255, 242, 0.1); color: var(--accent-cyan);">Work with Us</span>';

//             const row = `
//                 <tr>
//                     <td>${user.username}</td>
//                     <td>${user.email}</td>
//                     <td>${displayRole}</td>
//                     <td>${user.isAdmin ? 'Yes' : 'No'}</td>
//                     <td>${new Date(user.createdAt).toLocaleDateString()}</td>
//                     <td>
//                         <button class="action-btn" onclick="viewDetails('user', '${user._id}')" title="View Details"><i class="fas fa-eye"></i></button>
//                         <button class="action-btn delete" onclick="deleteItem('/api/user/${user._id}', loadUsers)" title="Delete"><i class="fas fa-trash"></i></button>
//                     </td>
//                 </tr>`;
//             tbody.innerHTML += row;
//         });
//     } catch (err) { console.error(err); }
// }

// async function loadProjects() {
//     try {
//         const res = await fetch('/api/admin/projects', { headers: { 'Authorization': getAuthHeader() } });
//         if (res.status === 401) return logout();
//         if (!res.ok) return;
//         loadedProjects = await res.json();

//         const tbody = document.getElementById('projectsBody');
//         tbody.innerHTML = '';

//         loadedProjects.forEach(p => {
//             let color = '#aaa';
//             if (p.status === 'completed') color = '#00ff00';
//             if (p.status === 'processing') color = '#00fff2';

//             const row = `
//                 <tr>
//                     <td><span style="color:${color}; font-weight:bold; font-size:0.8rem;">${p.status.toUpperCase()}</span></td>
//                     <td>${p.title}</td>
//                     <td>${p.clientId || 'Guest Client'}</td>
//                     <td>${p.assignedTeam || '<span style="color:#555">Unassigned</span>'}</td>
//                     <td>${new Date(p.createdAt).toLocaleDateString()}</td>
//                     <td class="action-cell">
//                         <button class="action-btn" onclick="viewDetails('project', '${p._id}')" title="View Details"><i class="fas fa-eye"></i></button>
//                         <button class="action-btn" onclick="editProject('${p._id}', '${p.assignedTeam || ''}', '${p.status}')" title="Edit"><i class="fas fa-pencil-alt"></i></button>
//                         <button class="action-btn delete" onclick="deleteItem('/api/admin/project/${p._id}', loadProjects)" title="Delete"><i class="fas fa-trash"></i></button>
//                     </td>
//                 </tr>`;
//             tbody.innerHTML += row;
//         });
//     } catch (err) { console.error(err); }
// }

// function viewDetails(type, id) {
//     let data = null;
//     let title = "Details";

//     if (type === 'app') {
//         data = loadedApps.find(x => x._id === id);
//         title = "Application Details";
//     } else if (type === 'user') {
//         data = loadedUsers.find(x => x._id === id);
//         title = "User Profile";
//     } else if (type === 'project') {
//         data = loadedProjects.find(x => x._id === id);
//         title = "Project Manifest";
//     }

//     if (!data) return alert("Data not found");

//     const newWin = window.open('', '_blank');
//     let htmlContent = '';

//     for (const [key, value] of Object.entries(data)) {
//         if (key === '__v' || key === 'password' || key === '_id' || key === 'updatedAt') continue;

//         let displayValue = value;
//         let displayKey = key.replace(/([A-Z])/g, ' $1').trim().toUpperCase();

//         if (key.toLowerCase().includes('date') || key === 'createdAt') {
//             displayValue = new Date(value).toLocaleString();
//         }

//         if (key === 'motive') {
//             displayKey = "MEMBERSHIP TYPE";
//             if (value === 'learning') {
//                 displayValue = '<strong style="color: #00ff00;">New Member (Joining)</strong>';
//             } else if (value === 'projects') {
//                 displayValue = '<strong style="color: #00fff2;">Old Member (Existing)</strong>';
//             }
//         }

//         if (key === 'department' && value) {
//             displayValue = value.charAt(0).toUpperCase() + value.slice(1);
//         }

//         if (!displayValue && displayValue !== 0) displayValue = '<span style="color:#555">N/A</span>';

//         htmlContent += `
//             <div class="item">
//                 <div class="label">${displayKey}</div>
//                 <div class="value">${displayValue}</div>
//             </div>
//         `;
//     }

//     newWin.document.write(`
//         <html>
//             <head>
//                 <title>${title} | Novaa Admin</title>
//                 <style>
//                     body { background-color: #0a0a0a; color: #fff; font-family: 'Segoe UI', sans-serif; padding: 40px; }
//                     h2 { color: #00fff2; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 30px; }
//                     .item { margin-bottom: 20px; background: #111; padding: 15px; border-radius: 8px; border: 1px solid #222; }
//                     .label { color: #00fff2; font-size: 0.8rem; margin-bottom: 5px; opacity: 0.8; }
//                     .value { font-size: 1.1rem; word-wrap: break-word; }
//                 </style>
//             </head>
//             <body>
//                 <h2>${title}</h2>
//                 ${htmlContent}
//             </body>
//         </html>
//     `);
//     newWin.document.close();
// }

// async function toggleAppStatus(id, newStatus) {
//     try {
//         await fetch(`/api/application/${id}/status`, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': getAuthHeader()
//             },
//             body: JSON.stringify({ status: newStatus })
//         });
//         loadApps();
//     } catch(err) {
//         console.error(err);
//         alert("Failed to update status");
//     }
// }

// function openIdCardModal(id) {
//     document.getElementById('simpleAppId').value = id;

//     const app = loadedApps.find(x => x._id === id) || {};

//     document.getElementById('simpleRole').value = app.assignedRole || '';
//     document.getElementById('simpleTeam').value = app.assignedTeam || '';
//     document.getElementById('simplePost').value = app.assignedPost || '';
//     document.getElementById('simpleMsg').value = app.adminMessage || '';
//     document.getElementById('simpleWork').value = app.assignedWork || '';

//     document.getElementById('simpleIdModal').style.display = 'flex';
// }

// function closeSimpleModal() {
//     document.getElementById('simpleIdModal').style.display = 'none';
// }

// async function submitSimpleCard() {
//     const id = document.getElementById('simpleAppId').value;
//     const payload = {
//         assignedRole: document.getElementById('simpleRole').value,
//         assignedTeam: document.getElementById('simpleTeam').value,
//         assignedLeader: document.getElementById('simpleLeader').value,
//         assignedPost: document.getElementById('simplePost').value,
//         adminMessage: document.getElementById('simpleMsg').value,
//         assignedWork: document.getElementById('simpleWork').value
//     };

//     try {
//         await fetch(`/api/application/${id}/card-details`, {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
//             body: JSON.stringify(payload)
//         });
//         closeSimpleModal();
//         loadApps();
//         alert("ID Card updated successfully!");
//     } catch(err) {
//         console.error(err);
//         alert("Failed to save ID Card details");
//     }
// }

// function editProject(id, team, status) {
//     document.getElementById('editProjectId').value = id;
//     document.getElementById('teamInput').value = team;
//     document.getElementById('projectModal').style.display = 'flex';
//     setProjectStatus(status);
// }

// function setProjectStatus(status) {
//     currentEditStatus = status;
//     document.querySelectorAll('.status-option').forEach(btn => {
//         btn.classList.remove('active');
//         if (btn.innerText.toLowerCase().replace(' ', '_').includes(status.split('_')[0])) {
//             btn.classList.add('active');
//         }
//     });
// }

// async function saveProjectChanges() {
//     const id = document.getElementById('editProjectId').value;
//     const team = document.getElementById('teamInput').value;

//     await fetch(`/api/admin/project/${id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
//         body: JSON.stringify({ assignedTeam: team, status: currentEditStatus })
//     });

//     closeModal('projectModal');
//     loadProjects();
// }

// function closeModal(modalId) {
//     document.getElementById(modalId).style.display = 'none';
// }

// function deleteItem(url, reloadCallback) {
//     if (confirm('Are you sure you want to permanently delete this?')) {
//         fetch(url, { method: 'DELETE', headers: { 'Authorization': getAuthHeader() } })
//             .then(() => reloadCallback());
//     }
// }

// window.onload = init;

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

            const currentStatus = app.status || 'pending';

            let statusBtn = '';
            if (currentStatus === 'pending') {
                statusBtn = `<button class="action-btn" onclick="toggleAppStatus('${app._id}', 'reviewed')" title="Mark Reviewed" style="color: #00ff00;"><i class="fas fa-check"></i></button>`;
            } else if (currentStatus === 'reviewed') {
                statusBtn = `<button class="action-btn" onclick="toggleAppStatus('${app._id}', 'pending')" title="Undo Review" style="color: orange;"><i class="fas fa-undo"></i></button>`;
            } else {
                statusBtn = `<button class="action-btn" onclick="toggleAppStatus('${app._id}', 'reviewed')" title="Mark Reviewed"><i class="fas fa-check"></i></button>`;
            }

            // Determine Role Display
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
                    <td>${new Date(app.createdAt).toLocaleDateString()}</td>
                    <td>
                        <button class="action-btn" onclick="viewDetails('app', '${app._id}')" title="View Details"><i class="fas fa-eye"></i></button>
                        <button class="action-btn" onclick="openIdCardModal('${app._id}')" title="Edit ID Card"><i class="fas fa-pencil-alt"></i></button>
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

    for (const [key, value] of Object.entries(data)) {
        if (key === '__v' || key === 'password' || key === '_id' || key === 'updatedAt') continue;

        let displayValue = value;
        let displayKey = key.replace(/([A-Z])/g, ' $1').trim().toUpperCase();

        if (key.toLowerCase().includes('date') || key === 'createdAt') {
            displayValue = new Date(value).toLocaleString();
        }

        if (key === 'motive') {
            displayKey = "MEMBERSHIP TYPE";
            if (value === 'learning') {
                displayValue = '<strong style="color: #00ff00;">New Member (Joining)</strong>';
            } else if (value === 'projects') {
                displayValue = '<strong style="color: #00fff2;">Old Member (Existing)</strong>';
            }
        }

        if (key === 'whichDev') {
            displayKey = "DEVELOPMENT DOMAIN";
        }

        if (key === 'department' && value) {
            displayValue = value.charAt(0).toUpperCase() + value.slice(1);
        }

        if (!displayValue && displayValue !== 0) displayValue = '<span style="color:#555">N/A</span>';

        htmlContent += `
            <div class="item">
                <div class="label">${displayKey}</div>
                <div class="value">${displayValue}</div>
            </div>
        `;
    }

    newWin.document.write(`
        <html>
            <head>
                <title>${title} | Novaa Admin</title>
                <style>
                    body { background-color: #0a0a0a; color: #fff; font-family: 'Segoe UI', sans-serif; padding: 40px; }
                    h2 { color: #00fff2; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 30px; }
                    .item { margin-bottom: 20px; background: #111; padding: 15px; border-radius: 8px; border: 1px solid #222; }
                    .label { color: #00fff2; font-size: 0.8rem; margin-bottom: 5px; opacity: 0.8; }
                    .value { font-size: 1.1rem; word-wrap: break-word; }
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
        await fetch(`/api/application/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthHeader()
            },
            body: JSON.stringify({ status: newStatus })
        });
        loadApps();
    } catch (err) {
        console.error(err);
        alert("Failed to update status");
    }
}

function openIdCardModal(id) {
    document.getElementById('simpleAppId').value = id;

    const app = loadedApps.find(x => x._id === id) || {};

    document.getElementById('simpleRole').value = app.assignedRole || '';
    document.getElementById('simpleTeam').value = app.assignedTeam || '';
    document.getElementById('simplePost').value = app.assignedPost || '';
    document.getElementById('simpleMsg').value = app.adminMessage || '';
    document.getElementById('simpleWork').value = app.assignedWork || '';

    document.getElementById('simpleIdModal').style.display = 'flex';
}

function closeSimpleModal() {
    document.getElementById('simpleIdModal').style.display = 'none';
}

async function submitSimpleCard() {
    const id = document.getElementById('simpleAppId').value;
    const payload = {
        assignedRole: document.getElementById('simpleRole').value,
        assignedTeam: document.getElementById('simpleTeam').value,
        assignedPost: document.getElementById('simplePost').value,
        adminMessage: document.getElementById('simpleMsg').value,
        assignedWork: document.getElementById('simpleWork').value
    };

    try {
        await fetch(`/api/application/${id}/card-details`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
            body: JSON.stringify(payload)
        });
        closeSimpleModal();
        loadApps();
        alert("ID Card updated successfully!");
    } catch (err) {
        console.error(err);
        alert("Failed to save ID Card details");
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