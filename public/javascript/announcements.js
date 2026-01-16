document.addEventListener('DOMContentLoaded', loadUpdates);

const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const overlay = document.getElementById('mobileNavOverlay');
const closeNav = document.getElementById('closeNav');
const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

async function loadUpdates() {
    const container = document.getElementById('updatesList');

    try {
        const res = await fetch('/api/announcements');
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        if (data.length === 0) {
            container.innerHTML = '<div style="text-align:center; color:#666; padding:40px;">No updates found.</div>';
            return;
        }

        container.innerHTML = '';

        data.forEach((item, index) => {
            const delay = index * 0.1;
            const div = document.createElement('div');
            div.className = `update-card type-${item.type}`;
            div.style.animationDelay = `${delay}s`;

            const date = new Date(item.createdAt).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            let icon = 'fa-info-circle';
            if (item.type === 'alert') icon = 'fa-exclamation-triangle';
            if (item.type === 'event') icon = 'fa-calendar-star';

            // Prepare replies
            let repliesHtml = '';
            if (item.replies && item.replies.length > 0) {
                item.replies.forEach(r => {
                    const rTime = new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    // Assuming basic visual check for 'You' vs others would require user ID context
                    // For now, render all as standard bubbles
                    repliesHtml += `
                        <div class="chat-bubble other">
                            <span class="chat-user">${r.username}</span>
                            ${formatText(r.text)}
                            <span class="chat-time">${rTime}</span>
                        </div>
                    `;
                });
            } else {
                repliesHtml = '<div style="text-align:center; color:#666; font-size:0.8rem; margin-bottom:10px;">No replies yet.</div>';
            }

            div.innerHTML = `
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="fas ${icon}" style="margin-right:8px; opacity:0.8;"></i>
                        ${item.title}
                    </h3>
                    <span class="card-date">${date}</span>
                </div>
                <div class="card-body">${formatText(item.message)}</div>

                <button class="reply-toggle-btn" onclick="toggleReplies('${item._id}')">
                    <i class="fas fa-comments"></i> Discussion (${item.replies ? item.replies.length : 0})
                </button>

                <div class="reply-section" id="replies-${item._id}">
                    <div class="reply-list" id="list-${item._id}">
                        ${repliesHtml}
                    </div>
                    <div class="reply-input-box">
                        <input type="text" class="reply-input" id="input-${item._id}" placeholder="Write a reply...">
                        <button class="reply-send" onclick="sendReply('${item._id}')"><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            `;

            container.appendChild(div);
        });

    } catch (err) {
        console.error(err);
        container.innerHTML = '<div style="text-align:center; color:#ff3333;">Failed to load updates.</div>';
    }
}

function formatText(text) {
    if (!text) return '';
    return text.replace(/\n/g, '<br>');
}

function toggleReplies(id) {
    const section = document.getElementById(`replies-${id}`);
    if (section.classList.contains('open')) {
        section.classList.remove('open');
    } else {
        section.classList.add('open');
    }
}

async function sendReply(id) {
    const input = document.getElementById(`input-${id}`);
    const text = input.value.trim();
    if (!text) return;

    try {
        const res = await fetch(`/api/announcement/${id}/reply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (res.status === 401) {
            alert("Login required.");
            return;
        }

        const data = await res.json();
        if (data.success) {
            const list = document.getElementById(`list-${id}`);
            if (list.innerHTML.includes('No replies yet')) list.innerHTML = '';

            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            list.innerHTML += `
                <div class="chat-bubble user">
                    <span class="chat-user">You</span>
                    ${formatText(text)}
                    <span class="chat-time">${time}</span>
                </div>
            `;
            input.value = '';

            const section = document.getElementById(`replies-${id}`);
            section.scrollTop = section.scrollHeight;
        }
    } catch (e) { console.error(e); }
}

function toggleMenu() {
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMenu);
closeNav.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

mobileLinks.forEach(link => {
    link.addEventListener('click', toggleMenu);
});

let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const edgeThreshold = 30;
    const swipeDistance = 50;

    if (touchEndX > touchStartX + swipeDistance) {
        if (!mobileNav.classList.contains('active') && touchStartX < edgeThreshold) {
            toggleMenu();
        }
    }
    if (touchEndX < touchStartX - swipeDistance) {
        if (mobileNav.classList.contains('active')) {
            toggleMenu();
        }
    }
}

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