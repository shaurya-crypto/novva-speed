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
//     let info = document.getElementById("all");
//     info.href = `/api/application/allinfo/${id}`;
// }

// let info = document.getElementById("all");
// info.addEventListener("click", allinfo);

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
// }

document.addEventListener('DOMContentLoaded', fetchApplications);

async function fetchApplications() {
    try {
        const response = await fetch('/api/applications');
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert("Failed to load data. Make sure you are logged in.");
    }
}

function renderTable(apps) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    if (apps.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 20px;">No applications found.</td></tr>';
        return;
    }

    apps.forEach(app => {
        const tr = document.createElement('tr');
        const isChecked = app.status === 'checked';

        if (isChecked) tr.classList.add('row-checked');

        tr.innerHTML = `
            <td>
                <span class="status-badge ${isChecked ? 'status-checked' : 'status-pending'}">
                    ${app.status.toUpperCase()}
                </span>
            </td>
            <td>
                <div style="font-weight:bold;">${app.fullName}</div>
                <div style="font-size:0.8rem; color:#888;">${app.city}, ${app.age}yo</div>
            </td>
            <td>
                <div><a href="mailto:${app.email}" class="details-link">${app.email}</a></div>
                <div style="font-size:0.8rem; color:#888;">${app.phone}</div>
            </td>
            <td>
                <div style="color:var(--accent-cyan);">${app.primarySkillset}</div>
                <div style="font-size:0.8rem;">${app.educationStatus}</div>
            </td>
            <td>${app.yearsExperience} yrs</td>
            <td>${new Date(app.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="action-btn check-btn" onclick="toggleStatus('${app._id}', '${app.status}')" title="Mark Checked/Pending">
                    <i class="fas ${isChecked ? 'fa-undo' : 'fa-check'}"></i>
                </button>
                
                <button class="action-btn" style="background:rgba(0,210,255,0.1); color:#00d2ff;" onclick="allinfo('${app._id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>

                <button class="action-btn delete-btn" onclick="deleteApp('${app._id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 'pending' ? 'checked' : 'pending';
    try {
        const res = await fetch(`/api/application/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (res.ok) {
            fetchApplications();
        }
    } catch (err) {
        alert('Error updating status');
    }
}

function allinfo(id) {
    window.location.href = `/api/application/allinfo/${id}`;
}

async function deleteApp(id) {
    if (!confirm('Are you sure you want to permanently delete this application?')) return;

    try {
        const res = await fetch(`/api/application/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {   
            fetchApplications();
        }
    } catch (err) {
        alert('Error deleting application');
    }
}