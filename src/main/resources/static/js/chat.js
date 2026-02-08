let currentItemId = null;
let currentUser = null;
let chatMessages = [];

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentItemId = urlParams.get('itemId');
    currentUser = localStorage.getItem('username');
    
    if (!currentItemId || !currentUser) {
        alert('Invalid chat session');
        goBack();
        return;
    }
    
    loadChatInfo();
    loadMessages();
    setupMessageInput();
    
    // Auto-refresh messages every 3 seconds
    setInterval(loadMessages, 3000);
});

async function loadChatInfo() {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('/api/items', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        const items = await response.json();
        const item = items.find(i => i.id == currentItemId);
        
        if (item) {
            document.getElementById('chat-title').textContent = `${item.category} Found`;
            const subtitle = document.querySelector('.chat-subtitle');
            if (subtitle) {
                subtitle.textContent = `Location: ${item.locationFound}`;
            }
        }
    } catch (error) {
        console.error('Error loading item info:', error);
    }
}

async function loadMessages() {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`/api/chat/messages/${currentItemId}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        if (response.ok) {
            chatMessages = await response.json();
            displayMessages();
        }
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

function displayMessages() {
    const container = document.getElementById('chat-messages');
    const systemMessage = container.querySelector('.system-message');
    
    // Clear existing messages except system message
    const existingMessages = container.querySelectorAll('.message-wrapper');
    existingMessages.forEach(msg => msg.remove());
    
    chatMessages.forEach(message => {
        const messageWrapper = document.createElement('div');
        messageWrapper.className = `message-wrapper ${message.senderUsername === currentUser ? 'sent' : 'received'}`;
        
        let content = '';
        if (message.messageType === 'IMAGE') {
            content = `<img src="${message.mediaUrl}" alt="Image" style="max-width: 200px; border-radius: 12px;">`;
        } else if (message.messageType === 'VIDEO') {
            content = `<video controls style="max-width: 200px; border-radius: 12px;"><source src="${message.mediaUrl}"></video>`;
        } else {
            content = `<p class="message-text">${message.message || ''}</p>`;
        }
        
        messageWrapper.innerHTML = `
            <div class="message-bubble">
                ${content}
                ${message.message && message.messageType !== 'TEXT' ? `<p class="message-text">${message.message}</p>` : ''}
                <div class="message-time">${formatTime(message.timestamp)}</div>
            </div>
        `;
        
        container.appendChild(messageWrapper);
    });
    
    scrollToBottom();
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        alert('Please login to send messages');
        return;
    }
    
    try {
        const response = await fetch(`/api/chat/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ 
                itemId: currentItemId,
                message: text 
            })
        });
        
        if (response.ok) {
            input.value = '';
            loadMessages(); // Reload messages to show the new one
        } else {
            const error = await response.json();
            alert('Failed to send message: ' + error.error);
        }
    } catch (error) {
        alert('Failed to send message: ' + error.message);
    }
}

function setupMessageInput() {
    const input = document.getElementById('messageInput');
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
}

function scrollToBottom() {
    const container = document.getElementById('chat-messages');
    container.scrollTop = container.scrollHeight;
}

async function handleMediaUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        alert('Please login to send media');
        return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const uploadResponse = await fetch('/api/files/upload', {
            method: 'POST',
            body: formData
        });
        
        if (uploadResponse.ok) {
            const result = await uploadResponse.json();
            const messageType = file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO';
            
            const response = await fetch(`/api/chat/${currentItemId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ 
                    messageType: messageType,
                    mediaUrl: result.url
                })
            });
            
            if (response.ok) {
                loadMessages();
            }
        }
    } catch (error) {
        alert('Failed to upload media');
    }
    
    event.target.value = '';
}

function toggleEmojiPicker() {
    const picker = document.getElementById('emoji-picker');
    picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
}

function addEmoji(emoji) {
    const input = document.getElementById('messageInput');
    input.value += emoji;
    document.getElementById('emoji-picker').style.display = 'none';
    input.focus();
}

function goBack() {
    window.history.back();
}