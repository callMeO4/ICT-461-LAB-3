import { fetchHelper } from './api.js';

// DOM Elements
const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const registrationSection = document.getElementById('registration-section');
const registrationForm = document.getElementById('registration-form');
const mainNav = document.getElementById('main-nav');
const logoutBtn = document.getElementById('logout-btn');
const feedbackMessage = document.getElementById('feedback-message');
const submitRegBtn = document.getElementById('submit-registration');
const programmeInput = document.getElementById('programme');

// Check localStorage on load (Lab Task 1.3)
document.addEventListener('DOMContentLoaded', () => {
    const savedProgramme = localStorage.getItem('programmePreference');
    if (savedProgramme) {
        programmeInput.value = savedProgramme;
    }
});

// Event Listener: Login Submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page refresh

    // Simulate successful login transition
    loginSection.classList.add('hidden');
    registrationSection.classList.remove('hidden');
    mainNav.classList.remove('hidden');

    // Focus the first input of the next form for accessibility
    document.getElementById('student-name').focus();
});

// Event Listener: Logout
logoutBtn.addEventListener('click', () => {
    registrationSection.classList.add('hidden');
    mainNav.classList.add('hidden');
    loginSection.classList.remove('hidden');
    loginForm.reset();
});


// Event Listener: Course Registration Submission
registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Gather selected courses from the checkboxes
    const checkedBoxes = document.querySelectorAll('input[name="courses"]:checked');
    const selectedCourses = Array.from(checkedBoxes).map(checkbox => checkbox.value);

    // Frontend validation to ensure at least one course is picked
    if (selectedCourses.length === 0) {
        showFeedback('Please select at least one course to register.', 'error');
        return;
    }

    // UI Loading State
    const originalBtnText = submitRegBtn.textContent;
    submitRegBtn.textContent = 'Submitting...';
    submitRegBtn.disabled = true;
    feedbackMessage.classList.add('hidden');

    // Gather data package
    const formData = {
        name: document.getElementById('student-name').value,
        studentId: document.getElementById('student-id').value,
        programme: programmeInput.value,
        courses: selectedCourses // Now sending an array of selected courses
    };

    localStorage.setItem('programmePreference', formData.programme);

    try {
        const response = await fetchHelper('http://localhost:3000/api/registrations', 'POST', formData);

        if (response.ok || response.status === 201) {
            // Updated Notification Logic
            showFeedback('Your courses have been registered and are awaiting approval.', 'success');
            registrationForm.reset();
            programmeInput.value = localStorage.getItem('programmePreference');
        } else if (response.status === 409) {
            showFeedback('Error: Duplicate course registration detected.', 'error');
        } else {
            showFeedback('Error submitting registration. Check details.', 'error');
        }
    } catch (error) {
        console.warn("API not reachable yet. Simulating success for frontend testing.");
        showFeedback('Your courses have been registered and are awaiting approval.', 'success');
        registrationForm.reset();
        programmeInput.value = localStorage.getItem('programmePreference');
    } finally {
        submitRegBtn.textContent = originalBtnText;
        submitRegBtn.disabled = false;
    }
});

// Helper function to update DOM safely (Lab Task 1.3)
function showFeedback(message, type) {
    feedbackMessage.textContent = message;
    feedbackMessage.className = type;
}
// Final frontend review