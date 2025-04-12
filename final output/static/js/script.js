document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const closeChatbot = document.querySelector('.close-chatbot');
    const chatbotInput = document.querySelector('.chatbot-input input');
    const sendBtn = document.querySelector('.send-btn');
    const chatbotBody = document.querySelector('.chatbot-body');
    const skillsForm = document.querySelector('#skills-form');
    const contactForm = document.querySelector('.contact-form');
    const loginForm = document.querySelector('.auth-form');
    const signupForm = document.querySelector('.auth-form');

    // Initialize Chatbot as Open
    if (chatbotContainer) chatbotContainer.classList.add('open');

    // Toggle Mobile Navigation
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Toggle Chatbot
    if (closeChatbot) {
        closeChatbot.addEventListener('click', () => {
            chatbotContainer.classList.toggle('open');
        });
    }

    // Send Message to Backend
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message || !chatbotInput) return;

        addMessage(message, 'user');
        chatbotInput.value = '';

        const typingIndicator = showTypingIndicator();

        fetch('/chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            typingIndicator.remove();
            if (data.response) {
                addMessage(data.response, 'bot');
            } else if (data.error) {
                addMessage('Error: ' + data.error, 'bot');
            }
        })
        .catch(error => {
            typingIndicator.remove();
            addMessage('Oops, something went wrong!', 'bot');
            console.error('Error:', error);
        });
    }

    // Add Message to Chat
    function addMessage(text, sender) {
        if (!chatbotBody) return;
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', `${sender}-message`);
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.textContent = text;
        messageDiv.appendChild(contentDiv);
        chatbotBody.appendChild(messageDiv);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    // Show Typing Indicator
    function showTypingIndicator() {
        if (!chatbotBody) return document.createElement('div');
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('chat-message', 'bot-message', 'typing-indicator');
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.innerHTML = `
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        `;
        typingDiv.appendChild(contentDiv);
        chatbotBody.appendChild(typingDiv);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
        return typingDiv;
    }

    // Handle CSRF Token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                cookie = cookie.trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Handle Send Button
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);

    // Handle Enter Key
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // Handle Skills Form Submission
    if (skillsForm) {
        skillsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(skillsForm);
            let skillsSummary = 'Your skills summary:\n';
            for (let [key, value] of formData.entries()) {
                skillsSummary += `${key.replace('_', ' ')}: ${value}\n`;
            }

            addMessage('I submitted the skills assessment form!', 'user');
            const typingIndicator = showTypingIndicator();
            fetch('/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ message: skillsSummary })
            })
            .then(response => response.json())
            .then(data => {
                typingIndicator.remove();
                if (data.response) {
                    addMessage(data.response, 'bot');
                } else if (data.error) {
                    addMessage('Error: ' + data.error, 'bot');
                }
            })
            .catch(error => {
                typingIndicator.remove();
                addMessage('Oops, something went wrong!', 'bot');
                console.error('Error:', error);
            });
        });
    }

    // Handle Contact Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            fetch('/contact/', {  // Placeholder endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            })
            .catch(error => {
                alert('Oops, something went wrong!');
                console.error('Error:', error);
            });
        });
    }

    // Handle Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('#login-email').value;
            const password = loginForm.querySelector('#login-password').value;
            fetch('/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert(data.message);
                    window.location.href = '/'; // Redirect to homepage
                } else {
                    alert('Login failed: ' + (data.message || 'Invalid credentials'));
                }
            })
            .catch(error => {
                alert('Oops, something went wrong!');
                console.error('Error:', error);
            });
        });
    }

    // Handle Signup Form Submission
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = signupForm.querySelector('#signup-name').value;
            const email = signupForm.querySelector('#signup-email').value;
            const password = signupForm.querySelector('#signup-password').value;
            fetch('/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ name, email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert(data.message);
                    window.location.href = '/login'; // Redirect to login
                } else {
                    alert('Signup failed: ' + (data.message || 'Try again'));
                }
            })
            .catch(error => {
                alert('Oops, something went wrong!');
                console.error('Error:', error);
            });
        });
    }
});


// Chatbot Elements
const chatbotContainer = document.querySelector('.chatbot-container');
const closeChatbot = document.querySelector('.close-chatbot');
const chatbotInput = document.getElementById('chatbot-input');
const sendBtn = document.getElementById('send-btn');
const chatbotBody = document.getElementById('chatbot-body');

// Initialize Chatbot as Open
if (chatbotContainer) chatbotContainer.classList.add('open');

// Toggle Chatbot
if (closeChatbot) {
    closeChatbot.addEventListener('click', () => {
        chatbotContainer.classList.toggle('open');
    });
}

// Send Message to Backend
function sendMessage() {
    const message = chatbotInput.value.trim();
    if (!message || !chatbotInput) return;

    addMessage(message, 'user');
    chatbotInput.value = '';

    const typingIndicator = showTypingIndicator();

    fetch('/chat/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ message: message })
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        typingIndicator.remove();
        if (data.response) {
            addMessage(data.response, 'bot');
        } else if (data.error) {
            addMessage('Error: ' + data.error, 'bot');
        }
    })
    .catch(error => {
        typingIndicator.remove();
        addMessage('Oops, something went wrong! Please try again.', 'bot');
        console.error('Chatbot Error:', error);
    });
}

// Add Message to Chat
function addMessage(text, sender) {
    if (!chatbotBody) return;
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', `${sender}-message`);
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.textContent = text;
    messageDiv.appendChild(contentDiv);
    chatbotBody.appendChild(messageDiv);
    chatbotBody.scrollTop = chatbotBody.scrollHeight; // Auto-scroll to latest message
}

// Show Typing Indicator
function showTypingIndicator() {
    if (!chatbotBody) return document.createElement('div');
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('chat-message', 'bot-message', 'typing-indicator');
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
    `;
    typingDiv.appendChild(contentDiv);
    chatbotBody.appendChild(typingDiv);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
    return typingDiv;
}

// Handle CSRF Token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Handle Send Button
if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
}

// Handle Enter Key
if (chatbotInput) {
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}