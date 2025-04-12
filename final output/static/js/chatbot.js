class Chatbot {
    constructor() {
        this.container = document.querySelector('.chatbot-container');
        this.messagesContainer = document.querySelector('.chatbot-messages');
        this.input = document.querySelector('.chatbot-input input');
        this.sendButton = document.querySelector('.chatbot-input button');
        this.minimizeButton = document.querySelector('#minimize-chat');
        this.closeButton = document.querySelector('#close-chat');
        
        this.setupEventListeners();
        this.showInitialPrompt();
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.handleSend());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSend();
            }
        });

        this.minimizeButton.addEventListener('click', () => {
            this.container.classList.toggle('minimized');
        });

        this.closeButton.addEventListener('click', () => {
            this.container.style.display = 'none';
        });
    }

    showInitialPrompt() {
        const initialPrompt = `
            <div class="initial-prompt">
                <h4>AI Career Advisor</h4>
                <ul>
                    <li>Personalized career suggestions</li>
                    <li>Skills assessment</li>
                    <li>Education guidance</li>
                    <li>Industry insights</li>
                </ul>
                <p>How can I assist you today?</p>
            </div>
        `;
        this.addMessage(initialPrompt, 'bot');
    }

    addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.innerHTML = content;
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    handleSend() {
        const message = this.input.value.trim();
        if (message) {
            // Add user message
            this.addMessage(message, 'user');
            this.input.value = '';

            // Simulate bot response (replace with actual API call)
            this.simulateBotResponse();
        }
    }

    simulateBotResponse() {
        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing';
        typingDiv.innerHTML = 'Typing...';
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();

        // Simulate response delay
        setTimeout(() => {
            this.messagesContainer.removeChild(typingDiv);
            this.addMessage('I\'m here to help with your career questions. What specific guidance are you looking for?', 'bot');
        }, 1500);
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
}); 