const form = document.getElementById('multiStepForm');
const steps = Array.from(document.querySelectorAll('.form-step'));
const nextBtns = document.querySelectorAll('.next-btn');
const prevBtns = document.querySelectorAll('.prev-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-percentage');

const eduSelect = document.getElementById('educationStatus');
const schoolFields = document.getElementById('schoolFields');
const collegeFields = document.getElementById('collegeFields');

const motiveSelect = document.getElementById('motiveSelect');
const departmentWrapper = document.getElementById('departmentWrapper');
const departmentSelect = document.getElementById('departmentSelect');

const devTypeWrapper = document.getElementById('devTypeWrapper');
const whichDevSelect = document.getElementById('whichDevSelect');
const techWrapper = document.getElementById('techWrapper');
const prWrapper = document.getElementById('prWrapper');
const otherWrapper = document.getElementById('otherWrapper');

// --- SKILLS DATA ---
const baseSkills = ["Python", "Java", "C++", "C#", "Git/GitHub"]; 
const domainSkills = {
    web: ["HTML/CSS", "JavaScript", "React", "Node.js", "PHP", "TypeScript", "SQL", "NoSQL", "Next.js"],
    mobile: ["Swift", "Kotlin", "Flutter", "React Native", "Dart", "Objective-C"],
    chatbot: ["NLP", "LangChain", "OpenAI API", "Dialogflow", "RASA", "Vector DB"],
    ai_agent: ["Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "AutoGPT", "CrewAI", "LangGraph"],
    fullstack: ["HTML/CSS", "JavaScript", "React", "Node.js", "SQL", "NoSQL", "Docker", "AWS", "DevOps"]
};

const skillsContainer = document.getElementById('skillsContainer');
const hiddenInput = document.getElementById('preferredLanguageInput');
let selectedSkills = [];

function initSkillBoxes(domain) {
    if (!skillsContainer) return;
    skillsContainer.innerHTML = ''; 
    selectedSkills = [];
    if (hiddenInput) hiddenInput.value = '';

    let skillsToShow = [...baseSkills];
    if (domain && domainSkills[domain]) {
        skillsToShow = [...new Set([...baseSkills, ...domainSkills[domain]])]; 
    }

    skillsToShow.forEach(skill => {
        const box = document.createElement('div');
        box.className = 'skill-box';
        box.textContent = skill;
        box.addEventListener('click', () => {
            toggleSkill(skill, box);
        });
        skillsContainer.appendChild(box);
    });
}

function toggleSkill(skill, element) {
    if (selectedSkills.includes(skill)) {
        selectedSkills = selectedSkills.filter(s => s !== skill);
        element.classList.remove('selected');
    } else {
        selectedSkills.push(skill);
        element.classList.add('selected');
    }
    if (hiddenInput) {
        hiddenInput.value = selectedSkills.join(', ');
        // Trigger input event to clear validation error if any
        hiddenInput.dispatchEvent(new Event('input'));
    }
}

if (whichDevSelect) {
    whichDevSelect.addEventListener('change', function() {
        const domain = this.value;
        initSkillBoxes(domain);
    });
}

function toggleRequired(container, isRequired) {
    const inputs = container.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.type === 'hidden') return; 
        if (isRequired) {
            input.setAttribute('required', 'true');
        } else {
            input.removeAttribute('required');
            input.value = '';
            clearError(input);
        }
    });
}

if (eduSelect) {
    eduSelect.addEventListener('change', function () {
        schoolFields.style.display = 'none';
        toggleRequired(schoolFields, false);
        collegeFields.style.display = 'none';
        toggleRequired(collegeFields, false);

        if (this.value === 'school') {
            schoolFields.style.display = 'block';
            toggleRequired(schoolFields, true);
        } else if (this.value === 'college') {
            collegeFields.style.display = 'block';
            toggleRequired(collegeFields, true);
        }
    });
}

if (motiveSelect) {
    motiveSelect.addEventListener('change', function () {
        departmentWrapper.style.display = 'block';
        toggleRequired(departmentWrapper, true);

        devTypeWrapper.style.display = 'none';
        toggleRequired(devTypeWrapper, false);
        techWrapper.style.display = 'none';
        // Note: We handle skills validation manually, so no toggleRequired for hidden input here
        prWrapper.style.display = 'none';
        toggleRequired(prWrapper, false);
        otherWrapper.style.display = 'none';
        toggleRequired(otherWrapper, false);

        departmentSelect.value = "";

        const existingOtherOption = departmentSelect.querySelector('option[value="other"]');
        if (this.value === 'projects') {
            if (!existingOtherOption) {
                const otherOpt = document.createElement('option');
                otherOpt.value = 'other';
                otherOpt.text = 'Other';
                departmentSelect.add(otherOpt);
            }
        } else {
            if (existingOtherOption) {
                existingOtherOption.remove();
            }
        }
    });
}

if (departmentSelect) {
    departmentSelect.addEventListener('change', function () {
        devTypeWrapper.style.display = 'none';
        toggleRequired(devTypeWrapper, false);
        techWrapper.style.display = 'none';
        prWrapper.style.display = 'none';
        toggleRequired(prWrapper, false);
        otherWrapper.style.display = 'none';
        toggleRequired(otherWrapper, false);

        if (this.value === 'developer') {
            devTypeWrapper.style.display = 'block';
            toggleRequired(devTypeWrapper, true);
            techWrapper.style.display = 'block';
            initSkillBoxes('web'); 
        } else if (this.value === 'pr') {
            prWrapper.style.display = 'block';
            toggleRequired(prWrapper, true);
        } else if (this.value === 'other') {
            otherWrapper.style.display = 'block';
            toggleRequired(otherWrapper, true);
        }
    });
}

let currentStep = 0;

function showError(input, message) {
    // Handle hidden input error (for skills)
    let parent = input.parentElement;
    
    let errorDisplay = parent.querySelector('.error-message');
    if (!errorDisplay) {
        errorDisplay = document.createElement('small');
        errorDisplay.classList.add('error-message');
        parent.appendChild(errorDisplay);
    }
    errorDisplay.innerText = message;
    errorDisplay.style.display = 'block';
    
    // Visual shake on container if it's the skills section
    if (input.id === 'preferredLanguageInput') {
        const container = document.getElementById('skillsContainer');
        container.classList.add('shake');
        container.style.border = '1px solid red';
        setTimeout(() => {
            container.classList.remove('shake');
        }, 500);
    } else {
        input.classList.add('shake');
        input.style.borderBottomColor = 'red';
        setTimeout(() => {
            input.classList.remove('shake');
        }, 500);
    }
}

function clearError(input) {
    const parent = input.parentElement;
    const errorDisplay = parent.querySelector('.error-message');
    if (errorDisplay) {
        errorDisplay.innerText = '';
        errorDisplay.style.display = 'none';
    }
    
    if (input.id === 'preferredLanguageInput') {
        const container = document.getElementById('skillsContainer');
        container.style.border = 'none'; 
    } else {
        input.style.borderBottomColor = 'var(--accent-cyan)';
    }
}

function validateCurrentStep() {
    // Select inputs including hidden ones if they are relevant
    const currentInputs = steps[currentStep].querySelectorAll('input, select, textarea');
    let isValid = true;

    currentInputs.forEach(input => {
        // Skip irrelevant inputs (hidden/disabled/not required) EXCEPT our custom skills input
        if (input.type !== 'hidden' && input.offsetParent === null) return;
        if (input.type !== 'hidden' && !input.hasAttribute('required')) return;

        // Special check for Skills (Hidden Input)
        if (input.id === 'preferredLanguageInput') {
            // Only validate if tech wrapper is visible
            if (techWrapper.style.display !== 'none') {
                if (!input.value.trim()) {
                    isValid = false;
                    showError(input, 'Please select at least one skill');
                    
                    // Add listener to clear error when value changes
                    input.addEventListener('input', function() {
                        if (this.value.trim()) clearError(this);
                    }, { once: true }); 
                    return; // Skip standard validation
                }
            } else {
                return; // Skip if tech wrapper hidden
            }
        }

        const value = input.value.trim();
        let errorMessage = null;

        if (!value) {
            errorMessage = 'This field is required';
            if (input.type === 'checkbox') errorMessage = 'You must agree to the terms';
        } 
        
        else if (input.name === 'linkedinLink') {
            if (!value.includes('linkedin.com/in/')) {
                errorMessage = 'Please enter a valid LinkedIn profile URL';
            }
        }
        else if (input.name === 'phone') {
            const countryCode = document.getElementById('countryCode').value;
            if (!/^\d+$/.test(value)) {
                errorMessage = 'Phone number must contain only digits';
            }
            else if (countryCode === '+91' && value.length !== 10) {
                errorMessage = 'Indian phone number must be exactly 10 digits';
            }
            else if (value.length < 7 || value.length > 15) {
                errorMessage = 'Phone number length is invalid';
            }
        }
        else if (input.type === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                errorMessage = 'Please enter a valid email address';
            }
        } 
        else if (input.name === 'age') {
            const age = Number(value);
            if (isNaN(age) || age < 13 || age > 50) {
                errorMessage = 'Age must be between 13 and 50';
            }
        } 
        else if (input.type === 'checkbox') {
            if (!input.checked) {
                errorMessage = 'You must agree to the terms';
            }
        }

        if (errorMessage) {
            isValid = false;
            showError(input, errorMessage);
            input.addEventListener('input', function () { clearError(this); }, { once: true });
            if (input.type === 'checkbox' || input.tagName === 'SELECT') {
                input.addEventListener('change', function () { clearError(this); }, { once: true });
            }
        } else {
            clearError(input);
        }
    });

    return isValid;
}

function updateForm() {
    steps.forEach((step, index) => {
        step.classList.remove('active');
        if (index === currentStep) {
            step.classList.add('active');
        }
    });
    const totalSteps = steps.length - 1;
    const progress = (currentStep / totalSteps) * 100;
    progressBar.style.width = progress + '%';
    progressText.innerText = Math.round(progress) + '%';
}

nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (validateCurrentStep()) {
            if (currentStep < steps.length - 1) {
                currentStep++;
                updateForm();
            }
        }
    });
});

prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateForm();
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (currentStep < steps.length - 1) {
            if (validateCurrentStep()) {
                currentStep++;
                updateForm();
            }
        }
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitFinalForm();
});

function submitFinalForm() {
    if (validateCurrentStep()) {
        const country = document.getElementById('countryCode').value;
        // const phoneInput = document.querySelector('input[name="phone"]');
        // phoneInput.value = country + " " + phoneInput.value; 
        form.submit();
    }
}

updateForm();

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    checkAuthStatus();
    fetchUserEmail();
    initSkillBoxes(); 
});

function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const overlay = document.getElementById('mobileNavOverlay');
    const closeNav = document.getElementById('closeNav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    function toggleMenu() {
        if (!mobileNav || !overlay) return;
        mobileNav.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    }

    if (hamburger) hamburger.addEventListener('click', toggleMenu);
    if (closeNav) closeNav.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => { link.addEventListener('click', toggleMenu); });
}

async function checkAuthStatus() {
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
    } catch (err) { console.error("Auth check failed:", err); }
}

async function fetchUserEmail() {
    try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
            const data = await res.json();
            if (data.user && data.user.email) {
                const emailField = document.getElementById('emailField');
                if (emailField) emailField.value = data.user.email;
            }
        }
    } catch (err) { console.error("Failed to fetch user email:", err); }
}