const socket = io();

// DOM Elements
const nicknameModal = document.getElementById('nickname-modal');
const chatInterface = document.getElementById('chat-interface');
const nicknameForm = document.getElementById('nickname-form');
const nicknameInput = document.getElementById('nickname-input');
const nicknameError = document.getElementById('nickname-error');
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');
const onlineUsers = document.getElementById('online-users');
const onlineCount = document.getElementById('online-count');
const typingIndicator = document.getElementById('typing-indicator');
const typingText = document.getElementById('typing-text');
const messageType = document.getElementById('message-type');
const privateRecipient = document.getElementById('private-recipient');

// User state
let currentUser = null;
let typingTimeout = null;
let onlineUsersList = [];

// Theme management
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light Mode';
    } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark Mode';
    }
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

// Theme toggle event
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Nickname form handling
nicknameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nickname = nicknameInput.value.trim();
    
    if (nickname.length < 2) {
        showNicknameError('Nickname must be at least 2 characters long');
        return;
    }
    
    if (nickname.length > 20) {
        showNicknameError('Nickname must be less than 20 characters');
        return;
    }
    
    // Join chat with nickname
    socket.emit('join', nickname);
});

function showNicknameError(message) {
    nicknameError.textContent = message;
    nicknameError.style.display = 'block';
    setTimeout(() => {
        nicknameError.style.display = 'none';
    }, 3000);
}

// Update online users display
function updateOnlineUsersDisplay() {
    onlineUsers.innerHTML = '';
    onlineCount.textContent = `${onlineUsersList.length} online`;
    
    onlineUsersList.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'online-user';
        userElement.textContent = user.nickname;
        userElement.onclick = () => selectUserForPrivateMessage(user.nickname);
        onlineUsers.appendChild(userElement);
    });
    
    // Update private recipient dropdown
    updatePrivateRecipientDropdown();
}

function updatePrivateRecipientDropdown() {
    privateRecipient.innerHTML = '<option value="">Select user...</option>';
    onlineUsersList.forEach(user => {
        if (user.nickname !== currentUser) {
            const option = document.createElement('option');
            option.value = user.nickname;
            option.textContent = user.nickname;
            privateRecipient.appendChild(option);
        }
    });
}

function selectUserForPrivateMessage(nickname) {
    messageType.value = 'private';
    privateRecipient.value = nickname;
    togglePrivateMessageControls();
}

// Message type toggle
messageType.addEventListener('change', togglePrivateMessageControls);

function togglePrivateMessageControls() {
    const isPrivate = messageType.value === 'private';
    privateRecipient.style.display = isPrivate ? 'block' : 'none';
    
    if (isPrivate) {
        input.placeholder = 'Type private message...';
    } else {
        input.placeholder = 'Type your message...';
    }
}

// Add message to chat
function addMessage(messageData) {
    const item = document.createElement('li');
    
    // Check if it's a system message
    if (messageData.isSystem) {
        item.className = 'system-message';
        item.textContent = messageData.message;
    } else {
        // Regular or private message
        if (messageData.isPrivate) {
            item.className = 'private-message';
        }
        
        const messageHeader = document.createElement('div');
        messageHeader.className = 'message-header';
        
        const nickname = document.createElement('span');
        nickname.className = 'message-nickname';
        nickname.textContent = messageData.nickname;
        
        const time = document.createElement('span');
        time.className = 'message-time';
        time.textContent = formatTime(messageData.timestamp);
        
        messageHeader.appendChild(nickname);
        messageHeader.appendChild(time);
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = messageData.message;
        
        item.appendChild(messageHeader);
        item.appendChild(messageContent);
    }
    
    messages.appendChild(item);
    scrollToBottom();
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function scrollToBottom() {
    const messagesContainer = document.querySelector('.messages-container');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Typing indicator
function handleTyping() {
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }
    
    socket.emit('typing', true);
    
    typingTimeout = setTimeout(() => {
        socket.emit('typing', false);
    }, 1000);
}

// Chat form handling
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = input.value.trim();
    
    if (!message) return;
    
    const isPrivate = messageType.value === 'private';
    const recipient = isPrivate ? privateRecipient.value : null;
    
    if (isPrivate && !recipient) {
        alert('Please select a recipient for private message');
        return;
    }
    
    // Send message
    socket.emit('chat message', {
        message: message,
        isPrivate: isPrivate,
        toUser: recipient
    });
    
    // Clear input and stop typing
    input.value = '';
    socket.emit('typing', false);
    
    // Reset to public message
    messageType.value = 'public';
    togglePrivateMessageControls();
});

// Input event listeners
input.addEventListener('input', handleTyping);
input.addEventListener('keyup', function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        form.dispatchEvent(new Event('submit', { cancelable: true }));
    }
});

// Socket event listeners
socket.on('nickname_error', (error) => {
    showNicknameError(error);
});

socket.on('online_users', (users) => {
    onlineUsersList = users;
    updateOnlineUsersDisplay();
});

socket.on('update_online_users', (users) => {
    onlineUsersList = users;
    updateOnlineUsersDisplay();
});

socket.on('user_joined', (data) => {
    addMessage({
        isSystem: true,
        message: data.message,
        timestamp: data.timestamp
    });
});

socket.on('user_left', (data) => {
    addMessage({
        isSystem: true,
        message: data.message,
        timestamp: data.timestamp
    });
});

socket.on('chat message', (messageData) => {
    addMessage(messageData);
});

socket.on('typing_status', (data) => {
    if (data.isTyping) {
        typingText.textContent = `${data.nickname} is typing...`;
        typingIndicator.style.display = 'block';
    } else {
        typingIndicator.style.display = 'none';
    }
});

socket.on('error', (error) => {
    alert(error);
});

// Handle successful join
socket.on('join_success', (userData) => {
    currentUser = userData.nickname;
    nicknameModal.style.display = 'none';
    chatInterface.style.display = 'flex';
    input.focus();
});

// Initialize private message controls
togglePrivateMessageControls(); 