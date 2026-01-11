// // const form = document.getElementById('multiStepForm');
// // const steps = Array.from(document.querySelectorAll('.form-step'));
// // const nextBtns = document.querySelectorAll('.next-btn');
// // const prevBtns = document.querySelectorAll('.prev-btn');
// // const progressBar = document.getElementById('progress-bar');
// // const progressText = document.getElementById('progress-percentage');

// // let currentStep = 0;

// // function showError(input, message) {
// //     const parent = input.parentElement;
// //     let errorDisplay = parent.querySelector('.error-message');

// //     if (!errorDisplay) {
// //         errorDisplay = document.createElement('small');
// //         errorDisplay.classList.add('error-message');
// //         parent.appendChild(errorDisplay);
// //     }

// //     errorDisplay.innerText = message;
// //     errorDisplay.style.display = 'block';

// //     input.classList.add('shake');
// //     input.style.borderBottomColor = 'red';

// //     setTimeout(() => {
// //         input.classList.remove('shake');
// //     }, 500);
// // }

// // function clearError(input) {
// //     const parent = input.parentElement;
// //     const errorDisplay = parent.querySelector('.error-message');

// //     if (errorDisplay) {
// //         errorDisplay.innerText = '';
// //         errorDisplay.style.display = 'none';
// //     }

// //     input.style.borderBottomColor = 'var(--accent-cyan)';
// // }

// // function validateCurrentStep() {
// //     const currentInputs = steps[currentStep].querySelectorAll('input[required], select[required], textarea[required]');
// //     let isValid = true;

// //     currentInputs.forEach(input => {
// //         const value = input.value.trim();
// //         let errorMessage = null;

// //         if (!value) {
// //             errorMessage = 'This field is required';
// //             if(input.type === 'checkbox') errorMessage = 'You must agree to the terms';
// //         } else if (input.type === 'email') {
// //             const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //             if (!emailPattern.test(value)) {
// //                 errorMessage = 'Please enter a valid email address';
// //             }
// //         } else if (input.name === 'age') {
// //             const age = Number(value);
// //             if (isNaN(age) || age < 13 || age > 50) {
// //                 errorMessage = 'Age must be between 13 and 50';
// //             }
// //         } else if (input.type === 'checkbox') {
// //             if (!input.checked) {
// //                 errorMessage = 'You must agree to the terms';
// //             }
// //         }

// //         if (errorMessage) {
// //             isValid = false;
// //             showError(input, errorMessage);

// //             input.addEventListener('input', function() {
// //                 clearError(this);
// //             }, { once: true });
// //             if(input.type === 'checkbox') {
// //                 input.addEventListener('change', function() {
// //                     clearError(this);
// //                 }, { once: true });
// //             }
// //         } else {
// //             clearError(input);
// //         }
// //     });

// //     return isValid;
// // }

// // function updateForm() {
// //     steps.forEach((step, index) => {
// //         step.classList.remove('active');
// //         if (index === currentStep) {
// //             step.classList.add('active');
// //         }
// //     });

// //     const totalSteps = steps.length - 1;
// //     const progress = (currentStep / totalSteps) * 100;

// //     progressBar.style.width = progress + '%';
// //     progressText.innerText = Math.round(progress) + '%';
// // }

// // nextBtns.forEach(btn => {
// //     btn.addEventListener('click', () => {
// //         if (validateCurrentStep()) {
// //             if (currentStep < steps.length - 1) {
// //                 currentStep++;
// //                 updateForm();
// //             }
// //         }
// //     });
// // });

// // prevBtns.forEach(btn => {
// //     btn.addEventListener('click', () => {
// //         if (currentStep > 0) {
// //             currentStep--;
// //             updateForm();
// //         }
// //     });
// // });

// // document.addEventListener('keydown', (e) => {
// //     if (e.key === 'Enter') {
// //         e.preventDefault();
// //         if (currentStep < steps.length - 1) {
// //             if (validateCurrentStep()) {
// //                 currentStep++;
// //                 updateForm();
// //             }
// //         } else {
// //             submitFinalForm();
// //         }
// //     }
// // });

// // form.addEventListener('submit', (e) => {
// //     e.preventDefault();
// //     submitFinalForm();
// // });

// // function submitFinalForm() {
// //     if (validateCurrentStep()) {
// //         form.submit();
// //     }
// // }

// // updateForm();

// // const form = document.getElementById('multiStepForm');
// // const steps = Array.from(document.querySelectorAll('.form-step'));
// // const nextBtns = document.querySelectorAll('.next-btn');
// // const prevBtns = document.querySelectorAll('.prev-btn');
// // const progressBar = document.getElementById('progress-bar');
// // const progressText = document.getElementById('progress-percentage');

// // // --- Dynamic Education Fields Logic ---
// // const eduSelect = document.getElementById('educationStatus');
// // const schoolFields = document.getElementById('schoolFields');
// // const collegeFields = document.getElementById('collegeFields');

// // if (eduSelect) {
// //     eduSelect.addEventListener('change', function () {
// //         // Reset: Hide all and remove required
// //         schoolFields.style.display = 'none';
// //         toggleRequired(schoolFields, false);

// //         collegeFields.style.display = 'none';
// //         toggleRequired(collegeFields, false);

// //         // Logic
// //         if (this.value === 'school') {
// //             schoolFields.style.display = 'block';
// //             toggleRequired(schoolFields, true);
// //         } else if (this.value === 'college') {
// //             collegeFields.style.display = 'block';
// //             toggleRequired(collegeFields, true);
// //         }
// //     });
// // }

// // function toggleRequired(container, isRequired) {
// //     const inputs = container.querySelectorAll('input');
// //     inputs.forEach(input => {
// //         if (isRequired) {
// //             input.setAttribute('required', 'true');
// //         } else {
// //             input.removeAttribute('required');
// //             input.value = ''; // Clean data if hidden
// //             clearError(input); // Clear visual errors
// //         }
// //     });
// // }
// // // --------------------------------------

// // let currentStep = 0;

// // function showError(input, message) {
// //     const parent = input.parentElement;
// //     let errorDisplay = parent.querySelector('.error-message');

// //     if (!errorDisplay) {
// //         errorDisplay = document.createElement('small');
// //         errorDisplay.classList.add('error-message');
// //         parent.appendChild(errorDisplay);
// //     }

// //     errorDisplay.innerText = message;
// //     errorDisplay.style.display = 'block';

// //     input.classList.add('shake');
// //     input.style.borderBottomColor = 'red';

// //     setTimeout(() => {
// //         input.classList.remove('shake');
// //     }, 500);
// // }

// // function clearError(input) {
// //     const parent = input.parentElement;
// //     const errorDisplay = parent.querySelector('.error-message');

// //     if (errorDisplay) {
// //         errorDisplay.innerText = '';
// //         errorDisplay.style.display = 'none';
// //     }

// //     input.style.borderBottomColor = 'var(--accent-cyan)'; // Reset to default color
// // }

// // function validateCurrentStep() {
// //     // Only select inputs that are visible and required
// //     const currentInputs = steps[currentStep].querySelectorAll('input[required], select[required], textarea[required]');
// //     let isValid = true;

// //     currentInputs.forEach(input => {
// //         // Skip validation if the input is hidden (double check)
// //         if (input.offsetParent === null) return;

// //         const value = input.value.trim();
// //         let errorMessage = null;

// //         if (!value) {
// //             errorMessage = 'This field is required';
// //             if (input.type === 'checkbox') errorMessage = 'You must agree to the terms';
// //         } else if (input.type === 'email') {
// //             const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //             if (!emailPattern.test(value)) {
// //                 errorMessage = 'Please enter a valid email address';
// //             }
// //         } else if (input.name === 'age') {
// //             const age = Number(value);
// //             if (isNaN(age) || age < 13 || age > 40) {
// //                 errorMessage = 'Age must be between 13 and 40';
// //             }
// //         } else if (input.type === 'checkbox') {
// //             if (!input.checked) {
// //                 errorMessage = 'You must agree to the terms';
// //             }
// //         }

// //         if (errorMessage) {
// //             isValid = false;
// //             showError(input, errorMessage);

// //             input.addEventListener('input', function () {
// //                 clearError(this);
// //             }, { once: true });

// //             if (input.type === 'checkbox') {
// //                 input.addEventListener('change', function () {
// //                     clearError(this);
// //                 }, { once: true });
// //             }
// //         } else {
// //             clearError(input);
// //         }
// //     });

// //     return isValid;
// // }

// // function updateForm() {
// //     steps.forEach((step, index) => {
// //         step.classList.remove('active');
// //         if (index === currentStep) {
// //             step.classList.add('active');
// //         }
// //     });

// //     const totalSteps = steps.length - 1;
// //     const progress = (currentStep / totalSteps) * 100;

// //     progressBar.style.width = progress + '%';
// //     progressText.innerText = Math.round(progress) + '%';
// // }

// // nextBtns.forEach(btn => {
// //     btn.addEventListener('click', () => {
// //         if (validateCurrentStep()) {
// //             if (currentStep < steps.length - 1) {
// //                 currentStep++;
// //                 updateForm();
// //             }
// //         }
// //     });
// // });

// // prevBtns.forEach(btn => {
// //     btn.addEventListener('click', () => {
// //         if (currentStep > 0) {
// //             currentStep--;
// //             updateForm();
// //         }
// //     });
// // });

// // document.addEventListener('keydown', (e) => {
// //     if (e.key === 'Enter') {
// //         e.preventDefault();
// //         if (currentStep < steps.length - 1) {
// //             if (validateCurrentStep()) {
// //                 currentStep++;
// //                 updateForm();
// //             }
// //         } else {
// //             submitFinalForm();
// //         }
// //     }
// // });

// // form.addEventListener('submit', (e) => {
// //     e.preventDefault();
// //     submitFinalForm();
// // });

// // function submitFinalForm() {
// //     if (validateCurrentStep()) {
// //         form.submit();
// //     }
// // }

// // updateForm();

// const form = document.getElementById('multiStepForm');
// const steps = Array.from(document.querySelectorAll('.form-step'));
// const nextBtns = document.querySelectorAll('.next-btn');
// const prevBtns = document.querySelectorAll('.prev-btn');
// const progressBar = document.getElementById('progress-bar');
// const progressText = document.getElementById('progress-percentage');

// const eduSelect = document.getElementById('educationStatus');
// const schoolFields = document.getElementById('schoolFields');
// const collegeFields = document.getElementById('collegeFields');
// const hamburger = document.getElementById('hamburger');
// const mobileNav = document.getElementById('mobileNav');
// const overlay = document.getElementById('mobileNavOverlay');
// const closeNav = document.getElementById('closeNav');
// const mobileLinks = document.querySelectorAll('.mobile-nav-links a');


// if (eduSelect) {
//     eduSelect.addEventListener('change', function () {
//         schoolFields.style.display = 'none';
//         toggleRequired(schoolFields, false);

//         collegeFields.style.display = 'none';
//         toggleRequired(collegeFields, false);

//         if (this.value === 'school') {
//             schoolFields.style.display = 'block';
//             toggleRequired(schoolFields, true);
//         } else if (this.value === 'college') {
//             collegeFields.style.display = 'block';
//             toggleRequired(collegeFields, true);
//         }
//     });
// }

// function toggleRequired(container, isRequired) {
//     const inputs = container.querySelectorAll('input, select');
//     inputs.forEach(input => {
//         if (isRequired) {
//             input.setAttribute('required', 'true');
//         } else {
//             input.removeAttribute('required');
//             input.value = '';
//             clearError(input);
//         }
//     });
// }

// let currentStep = 0;

// function showError(input, message) {
//     const parent = input.parentElement;
//     let errorDisplay = parent.querySelector('.error-message');

//     if (!errorDisplay) {
//         errorDisplay = document.createElement('small');
//         errorDisplay.classList.add('error-message');
//         parent.appendChild(errorDisplay);
//     }

//     errorDisplay.innerText = message;
//     errorDisplay.style.display = 'block';

//     input.classList.add('shake');
//     input.style.borderBottomColor = 'red';

//     setTimeout(() => {
//         input.classList.remove('shake');
//     }, 500);
// }


// document.addEventListener("DOMContentLoaded", async () => {
//     try {
//         const res = await fetch('/auth/check-status');
//         const data = await res.json();

//         const navSignup = document.getElementById('nav-signup');
//         const navProfile = document.getElementById('nav-profile');
//         const mobileSignup = document.getElementById('mobile-signup');
//         const mobileProfile = document.getElementById('mobile-profile');

//         if (data.loggedIn) {
//             if (navSignup) navSignup.style.display = 'none';
//             if (navProfile) navProfile.style.display = 'block';

//             if (mobileSignup) mobileSignup.style.display = 'none';
//             if (mobileProfile) mobileProfile.style.display = 'block';
//         } else {
//             if (navSignup) navSignup.style.display = 'block';
//             if (navProfile) navProfile.style.display = 'none';

//             if (mobileSignup) mobileSignup.style.display = 'block';
//             if (mobileProfile) mobileProfile.style.display = 'none';
//         }
//     } catch (err) {
//         console.error("Auth check failed:", err);
//     }
// });

// function clearError(input) {
//     const parent = input.parentElement;
//     const errorDisplay = parent.querySelector('.error-message');

//     if (errorDisplay) {
//         errorDisplay.innerText = '';
//         errorDisplay.style.display = 'none';
//     }

//     input.style.borderBottomColor = 'var(--accent-cyan)';
// }

// function validateCurrentStep() {
//     const currentInputs = steps[currentStep].querySelectorAll('input[required], select[required], textarea[required]');
//     let isValid = true;

//     currentInputs.forEach(input => {
//         if (input.offsetParent === null) return;

//         const value = input.value.trim();
//         let errorMessage = null;

//         if (!value) {
//             errorMessage = 'This field is required';
//             if (input.type === 'checkbox') errorMessage = 'You must agree to the terms';
//         } else if (input.type === 'email') {
//             const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//             if (!emailPattern.test(value)) {
//                 errorMessage = 'Please enter a valid email address';
//             }
//         } else if (input.name === 'age') {
//             const age = Number(value);
//             if (isNaN(age) || age < 13 || age > 40) {
//                 errorMessage = 'Age must be between 13 and 40';
//             }
//         } else if (input.type === 'checkbox') {
//             if (!input.checked) {
//                 errorMessage = 'You must agree to the terms';
//             }
//         }

//         if (errorMessage) {
//             isValid = false;
//             showError(input, errorMessage);

//             input.addEventListener('input', function () {
//                 clearError(this);
//             }, { once: true });

//             if (input.type === 'checkbox' || input.tagName === 'SELECT') {
//                 input.addEventListener('change', function () {
//                     clearError(this);
//                 }, { once: true });
//             }
//         } else {
//             clearError(input);
//         }
//     });

//     return isValid;
// }

// function updateForm() {
//     steps.forEach((step, index) => {
//         step.classList.remove('active');
//         if (index === currentStep) {
//             step.classList.add('active');
//         }
//     });

//     const totalSteps = steps.length - 1;
//     const progress = (currentStep / totalSteps) * 100;

//     progressBar.style.width = progress + '%';
//     progressText.innerText = Math.round(progress) + '%';
// }

// nextBtns.forEach(btn => {
//     btn.addEventListener('click', () => {
//         if (validateCurrentStep()) {
//             if (currentStep < steps.length - 1) {
//                 currentStep++;
//                 updateForm();
//             }
//         }
//     });
// });

// prevBtns.forEach(btn => {
//     btn.addEventListener('click', () => {
//         if (currentStep > 0) {
//             currentStep--;
//             updateForm();
//         }
//     });
// });

// document.addEventListener('keydown', (e) => {
//     if (e.key === 'Enter') {
//         e.preventDefault();
//         if (currentStep < steps.length - 1) {
//             if (validateCurrentStep()) {
//                 currentStep++;
//                 updateForm();
//             }
//         } else {
//             submitFinalForm();
//         }
//     }
// });

// form.addEventListener('submit', (e) => {
//     e.preventDefault();
//     submitFinalForm();
// });

// function submitFinalForm() {
//     if (validateCurrentStep()) {
//         form.submit();
//     }
// }

// updateForm();

// document.addEventListener('DOMContentLoaded', () => {
//     initMobileNav();
//     checkAuthStatus();
// });

// // --- 1. Mobile Navigation Logic ---
// function initMobileNav() {
//     const hamburger = document.getElementById('hamburger');
//     const mobileNav = document.getElementById('mobileNav');
//     const overlay = document.getElementById('mobileNavOverlay');
//     const closeNav = document.getElementById('closeNav');
//     const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

//     function toggleMenu() {
//         if (!mobileNav || !overlay) return;

//         mobileNav.classList.toggle('active');
//         overlay.classList.toggle('active');

//         // Prevent background scrolling when menu is open
//         document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
//     }

//     if (hamburger) hamburger.addEventListener('click', toggleMenu);
//     if (closeNav) closeNav.addEventListener('click', toggleMenu);
//     if (overlay) overlay.addEventListener('click', toggleMenu);

//     // Close menu when any link inside is clicked
//     mobileLinks.forEach(link => {
//         link.addEventListener('click', toggleMenu);
//     });

//     // --- Touch Gestures (Swipe to Open/Close) ---
//     let touchStartX = 0;
//     let touchEndX = 0;

//     document.addEventListener('touchstart', e => {
//         touchStartX = e.changedTouches[0].screenX;
//     }, false);

//     document.addEventListener('touchend', e => {
//         touchEndX = e.changedTouches[0].screenX;

//         // Swipe Left to Close (if menu is open)
//         if (touchEndX < touchStartX - 50 && mobileNav.classList.contains('active')) {
//             toggleMenu();
//         }

//         // Swipe Right to Open (from edge, if menu is closed)
//         if (touchEndX > touchStartX + 50 && touchStartX < 30 && !mobileNav.classList.contains('active')) {
//             toggleMenu();
//         }
//     }, false);
// }

// // --- 2. Auth Status Check (Toggle Sign Up / Profile) ---
// async function checkAuthStatus() {
//     try {
//         const res = await fetch('/auth/check-status');
//         const data = await res.json();

//         // Desktop Elements
//         const navSignup = document.getElementById('nav-signup');
//         const navProfile = document.getElementById('nav-profile');

//         // Mobile Elements
//         const mobileSignup = document.getElementById('mobile-signup');
//         const mobileProfile = document.getElementById('mobile-profile');

//         if (data.loggedIn) {
//             // Logged In: Show Profile
//             if (navSignup) navSignup.style.display = 'none';
//             if (navProfile) navProfile.style.display = 'block';

//             if (mobileSignup) mobileSignup.style.display = 'none';
//             if (mobileProfile) mobileProfile.style.display = 'block';
//         } else {
//             // Not Logged In: Show Sign Up
//             if (navSignup) navSignup.style.display = 'block';
//             if (navProfile) navProfile.style.display = 'none';

//             if (mobileSignup) mobileSignup.style.display = 'block';
//             if (mobileProfile) mobileProfile.style.display = 'none';
//         }
//     } catch (err) {
//         console.error("Auth check failed:", err);
//     }
// }

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
const techWrapper = document.getElementById('techWrapper');
const prWrapper = document.getElementById('prWrapper');
const otherWrapper = document.getElementById('otherWrapper');

function toggleRequired(container, isRequired) {
    const inputs = container.querySelectorAll('input, select');
    inputs.forEach(input => {
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

        techWrapper.style.display = 'none';
        toggleRequired(techWrapper, false);
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
        techWrapper.style.display = 'none';
        toggleRequired(techWrapper, false);

        prWrapper.style.display = 'none';
        toggleRequired(prWrapper, false);

        otherWrapper.style.display = 'none';
        toggleRequired(otherWrapper, false);

        if (this.value === 'developer') {
            techWrapper.style.display = 'block';
            toggleRequired(techWrapper, true);
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
    const parent = input.parentElement;
    let errorDisplay = parent.querySelector('.error-message');

    if (!errorDisplay) {
        errorDisplay = document.createElement('small');
        errorDisplay.classList.add('error-message');
        parent.appendChild(errorDisplay);
    }

    errorDisplay.innerText = message;
    errorDisplay.style.display = 'block';

    input.classList.add('shake');
    input.style.borderBottomColor = 'red';

    setTimeout(() => {
        input.classList.remove('shake');
    }, 500);
}

function clearError(input) {
    const parent = input.parentElement;
    const errorDisplay = parent.querySelector('.error-message');

    if (errorDisplay) {
        errorDisplay.innerText = '';
        errorDisplay.style.display = 'none';
    }

    input.style.borderBottomColor = 'var(--accent-cyan)';
}

function validateCurrentStep() {
    const currentInputs = steps[currentStep].querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    currentInputs.forEach(input => {
        if (input.offsetParent === null) return;

        const value = input.value.trim();
        let errorMessage = null;

        if (!value) {
            errorMessage = 'This field is required';
            if (input.type === 'checkbox') errorMessage = 'You must agree to the terms';
        } else if (input.type === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                errorMessage = 'Please enter a valid email address';
            }
        } else if (input.name === 'age') {
            const age = Number(value);
            if (isNaN(age) || age < 13 || age > 40) {
                errorMessage = 'Age must be between 13 and 40';
            }
        } else if (input.type === 'checkbox') {
            if (!input.checked) {
                errorMessage = 'You must agree to the terms';
            }
        }

        if (errorMessage) {
            isValid = false;
            showError(input, errorMessage);

            input.addEventListener('input', function () {
                clearError(this);
            }, { once: true });

            if (input.type === 'checkbox' || input.tagName === 'SELECT') {
                input.addEventListener('change', function () {
                    clearError(this);
                }, { once: true });
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
    if (e.key === 'Enter') {
        e.preventDefault();
        if (currentStep < steps.length - 1) {
            if (validateCurrentStep()) {
                currentStep++;
                updateForm();
            }
        } else {
            submitFinalForm();
        }
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitFinalForm();
});

function submitFinalForm() {
    if (validateCurrentStep()) {
        form.submit();
    }
}

updateForm();

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    checkAuthStatus();
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

        if (touchEndX < touchStartX - 50 && mobileNav.classList.contains('active')) {
            toggleMenu();
        }

        if (touchEndX > touchStartX + 50 && touchStartX < 30 && !mobileNav.classList.contains('active')) {
            toggleMenu();
        }
    }, false);
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
    } catch (err) {
        console.error("Auth check failed:", err);
    }
}