// const form = document.getElementById('multiStepForm');
// const steps = Array.from(document.querySelectorAll('.form-step'));
// const nextBtns = document.querySelectorAll('.next-btn');
// const prevBtns = document.querySelectorAll('.prev-btn');
// const progressBar = document.getElementById('progress-bar');
// const progressText = document.getElementById('progress-percentage');

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
//         const value = input.value.trim();
//         let errorMessage = null;

//         if (!value) {
//             errorMessage = 'This field is required';
//             if(input.type === 'checkbox') errorMessage = 'You must agree to the terms';
//         } else if (input.type === 'email') {
//             const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//             if (!emailPattern.test(value)) {
//                 errorMessage = 'Please enter a valid email address';
//             }
//         } else if (input.name === 'age') {
//             const age = Number(value);
//             if (isNaN(age) || age < 13 || age > 50) {
//                 errorMessage = 'Age must be between 13 and 50';
//             }
//         } else if (input.type === 'checkbox') {
//             if (!input.checked) {
//                 errorMessage = 'You must agree to the terms';
//             }
//         }

//         if (errorMessage) {
//             isValid = false;
//             showError(input, errorMessage);

//             input.addEventListener('input', function() {
//                 clearError(this);
//             }, { once: true });
//             if(input.type === 'checkbox') {
//                 input.addEventListener('change', function() {
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

const form = document.getElementById('multiStepForm');
const steps = Array.from(document.querySelectorAll('.form-step'));
const nextBtns = document.querySelectorAll('.next-btn');
const prevBtns = document.querySelectorAll('.prev-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-percentage');

// --- Dynamic Education Fields Logic ---
const eduSelect = document.getElementById('educationStatus');
const schoolFields = document.getElementById('schoolFields');
const collegeFields = document.getElementById('collegeFields');

if (eduSelect) {
    eduSelect.addEventListener('change', function () {
        // Reset: Hide all and remove required
        schoolFields.style.display = 'none';
        toggleRequired(schoolFields, false);

        collegeFields.style.display = 'none';
        toggleRequired(collegeFields, false);

        // Logic
        if (this.value === 'school') {
            schoolFields.style.display = 'block';
            toggleRequired(schoolFields, true);
        } else if (this.value === 'college') {
            collegeFields.style.display = 'block';
            toggleRequired(collegeFields, true);
        }
    });
}

function toggleRequired(container, isRequired) {
    const inputs = container.querySelectorAll('input');
    inputs.forEach(input => {
        if (isRequired) {
            input.setAttribute('required', 'true');
        } else {
            input.removeAttribute('required');
            input.value = ''; // Clean data if hidden
            clearError(input); // Clear visual errors
        }
    });
}
// --------------------------------------

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

    input.style.borderBottomColor = 'var(--accent-cyan)'; // Reset to default color
}

function validateCurrentStep() {
    // Only select inputs that are visible and required
    const currentInputs = steps[currentStep].querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    currentInputs.forEach(input => {
        // Skip validation if the input is hidden (double check)
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

            if (input.type === 'checkbox') {
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