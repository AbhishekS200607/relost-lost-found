// Lost item reporting functionality
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    currentUser = localStorage.getItem('username');
    updateAuthUI();
    setupLostItemForm();
    setupPhotoPreview();
    setMaxDate();
});

function setMaxDate() {
    // Set max date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date-lost').max = today;
}

function updateAuthUI() {
    const token = localStorage.getItem('jwtToken');
    const username = localStorage.getItem('username');
    
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (token && username) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        logoutBtn.textContent = `Logout (${username})`;
    } else {
        loginBtn.style.display = 'inline-block';
        registerBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
    }
}

function setupLostItemForm() {
    const form = document.getElementById('lost-item-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            alert('Please login to report a lost item');
            window.location.href = 'login.html';
            return;
        }
        
        // For now, just show success message
        // In a real app, you'd send this to a backend API
        const formData = {
            itemName: document.getElementById('item-name').value,
            category: document.getElementById('category').value,
            description: document.getElementById('description').value,
            locationLost: document.getElementById('location-lost').value,
            dateLost: document.getElementById('date-lost').value,
            contactInfo: document.getElementById('contact-info').value
        };
        
        // Simulate API call
        try {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success message
            alert('Lost item report submitted successfully! We\'ll notify you if someone reports finding a matching item.');
            
            // Reset form
            form.reset();
            document.getElementById('photo-preview').innerHTML = '';
            document.getElementById('file-status').textContent = 'No file selected';
            
            // Restore button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
        } catch (error) {
            alert('Failed to submit report. Please try again.');
            
            // Restore button
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Submit Lost Report';
            submitBtn.disabled = false;
        }
    });
}

function setupPhotoPreview() {
    const photoInput = document.getElementById('photo');
    
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const preview = document.getElementById('photo-preview');
        const fileStatus = document.getElementById('file-status');
        
        if (file) {
            // Update file status
            fileStatus.textContent = file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name;
            
            // Show preview
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            fileStatus.textContent = 'No file selected';
            preview.innerHTML = '';
        }
    });
}

function logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}