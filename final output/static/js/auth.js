const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const signInForm = document.querySelector('.sign-in form');
const signUpForm = document.querySelector('.sign-up form');

// Function to check if device is mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Function to handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    // Add your form submission logic here
}

// Add form submission handlers
signInForm.addEventListener('submit', handleFormSubmit);
signUpForm.addEventListener('submit', handleFormSubmit);

// Function to toggle between forms
function toggleForms(showSignUp) {
    if (isMobile()) {
        container.classList.toggle('active');
        // Scroll to top when switching forms on mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        if (showSignUp) {
            container.classList.add('active');
        } else {
            container.classList.remove('active');
        }
    }
}

registerBtn.addEventListener('click', () => toggleForms(true));
loginBtn.addEventListener('click', () => toggleForms(false));

// Handle resize events
let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
    if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        if (!isMobile()) {
            container.classList.remove('active');
        }
    }
}); 