// Authentication functions
function checkAuthStatus() {
    const token = localStorage.getItem('jwtToken');
    const username = localStorage.getItem('username');
    
    if (token && username) {
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}

// Login form handler
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('jwtToken', data.token);
                localStorage.setItem('username', data.username);
                localStorage.setItem('userId', data.userId);
                window.location.href = 'index.html';
            } else {
                console.error('Login error:', data);
                alert('Login failed: ' + data.error);
            }
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    });
}

// Register form handler
if (document.getElementById('register-form')) {
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
            } else {
                alert('Registration failed: ' + data.error);
            }
        } catch (error) {
            alert('Registration failed: ' + error.message);
        }
    });
}

// Password toggle functionality
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePassword');
    const monkeyFace = document.querySelector('.monkey-face');
    
    if (passwordInput && toggleBtn) {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        
        // Update eye icon
        toggleBtn.innerHTML = isPassword ? '🙈' : '👁️';
        
        // Update monkey animation
        if (monkeyFace) {
            if (!isPassword) {
                // Password visible - monkey closes eyes
                monkeyFace.classList.add('eyes-closed');
                monkeyFace.classList.remove('eyes-open');
            } else {
                // Password hidden - monkey opens eyes
                monkeyFace.classList.remove('eyes-closed');
                monkeyFace.classList.add('eyes-open');
            }
        }
    }
}

// Check auth status on page load
document.addEventListener('DOMContentLoaded', () => {
    if (typeof updateAuthUI === 'function') {
        updateAuthUI();
    }
    
    // Setup password toggle
    const toggleBtn = document.getElementById('togglePassword');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', togglePassword);
    }
});