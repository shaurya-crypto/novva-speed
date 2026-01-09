
document.addEventListener('DOMContentLoaded', loadProfile);

let currentUser = {};

async function loadProfile() {
    try {
        const res = await fetch('/api/user/profile');
        if (res.status === 401) return window.location.href = '/login';

        const data = await res.json();
        const user = data.user;
        currentUser = user;


        document.getElementById('fullName').textContent = user.username;
        document.getElementById('username').textContent = user.username;
        document.getElementById('bio').textContent = user.bio;
        document.getElementById('email').textContent = user.email;
        document.getElementById('joinedDate').textContent = new Date(user.createdAt).toLocaleDateString();
        document.getElementById('profilePic').src = user.profilePic;


        document.getElementById('editName').value = user.username;
        document.getElementById('editBio').value = user.bio;


        if (data.hasSubmitted) {
            const app = data.applicationData;
            document.getElementById('formStatusBadge').textContent = app.status === 'checked' ? 'APPROVED' : 'PENDING REVIEW';
            document.getElementById('formStatusBadge').className = `badge ${app.status === 'checked' ? 'badge-success' : 'badge-pending'}`;
            document.getElementById('formDetails').style.display = 'block';
            document.getElementById('appRole').textContent = app.primarySkillset || app.educationStatus;
            document.getElementById('appExp').textContent = app.yearsExperience + " Years";
            document.getElementById('appDate').textContent = new Date(app.createdAt).toLocaleDateString();
        } else {
            document.getElementById('formStatusBadge').textContent = 'NOT SUBMITTED';
            document.getElementById('formCTA').style.display = 'block';
        }
    } catch (err) { console.error("Error:", err); }
}

function openEditModal() { document.getElementById('editModal').style.display = 'flex'; }
function closeEditModal() { document.getElementById('editModal').style.display = 'none'; }


document.getElementById('fileInput').addEventListener('change', function () {
    if (this.files && this.files[0]) {
        document.getElementById('fileName').textContent = this.files[0].name;
    }
});


document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newName = document.getElementById('editName').value;
    const newBio = document.getElementById('editBio').value;
    const fileInput = document.getElementById('fileInput');

    let base64Image = null;

    if (fileInput.files && fileInput.files[0]) {
        base64Image = await toBase64(fileInput.files[0]);
    }

    try {
        const payload = {
            username: newName,
            bio: newBio,
            profilePic: base64Image 
        };

        const res = await fetch('/api/user/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (result.success) {
            closeEditModal();
            loadProfile();
        } else {
            alert('Update failed');
        }
    } catch (err) {
        console.error("Update Error:", err);
    }
});


const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});


document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch('/auth/check-status');
        const data = await res.json();

        const navSignup = document.getElementById('nav-signup');
        const navProfile = document.getElementById('nav-profile');
        const mobileSignup = document.getElementById('mobile-signup');
        const mobileProfile = document.getElementById('mobile-profile');

        if (data.loggedIn) {
            if (navSignup) navSignup.style.display = 'none';
            if (navProfile) navProfile.style.display = 'block';

            if (mobileSignup) mobileSignup.style.display = 'none';
            if (mobileProfile) mobileProfile.style.display = 'block';
        } else {
            if (navSignup) navSignup.style.display = 'block';
            if (navProfile) navProfile.style.display = 'none';

            if (mobileSignup) mobileSignup.style.display = 'block';
            if (mobileProfile) mobileProfile.style.display = 'none';
        }
    } catch (err) {
        console.error("Auth check failed:", err);
    }
});