let currentUser = null;
let allItems = [];
let filteredItems = [];
let searchTimeout = null;

const categoryIcons = {
    WALLET: `<svg class="item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>`,
    KEYS: `<svg class="item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a3 3 0 100 6 3 3 0 000-6z"></path></svg>`,
    PHONE: `<svg class="item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>`,
    LAPTOP: `<svg class="item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`,
    WATCH: `<svg class="item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
    CARDS: `<svg class="item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"></path></svg>`,
    BOOK: `<svg class="item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path></svg>`,
    BAG: `<svg class="item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.007z"></path></svg>`
};

document.addEventListener('DOMContentLoaded', () => {
    loadItems();
    setupFilters();
    setupFilterToggle();
    currentUser = localStorage.getItem('username');
    updateAuthUI();
});

async function loadItems() {
    try {
        const response = await fetch('/api/lost-items');
        const items = await response.json();
        allItems = items;
        filteredItems = items;
        displayItems(filteredItems);
    } catch (error) {
        console.error('Error loading items:', error);
        document.getElementById('items-grid').innerHTML = '<p class="text-center text-muted-foreground">Failed to load items. Please try again later.</p>';
    }
}

function setupFilters() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const locationFilter = document.getElementById('location-filter');
    const dateFilter = document.getElementById('date-filter');
    const sortFilter = document.getElementById('sort-filter');

    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(applyFilters, 300);
    });

    [categoryFilter, locationFilter, dateFilter, sortFilter].forEach(input => {
        input.addEventListener('change', applyFilters);
    });
}

function setupFilterToggle() {
    const filterToggle = document.getElementById('filter-toggle');
    const filtersPanel = document.getElementById('filters-panel');
    
    filterToggle.addEventListener('click', () => {
        const isVisible = filtersPanel.style.display !== 'none';
        filtersPanel.style.display = isVisible ? 'none' : 'block';
        filterToggle.classList.toggle('active');
    });
}

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    const locationFilter = document.getElementById('location-filter').value.toLowerCase();
    const dateFilter = document.getElementById('date-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;

    filteredItems = allItems.filter(item => {
        const matchesSearch = !searchTerm || 
            item.description.toLowerCase().includes(searchTerm) ||
            item.itemName.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !categoryFilter || item.category === categoryFilter;
        const matchesLocation = !locationFilter || item.locationLost.toLowerCase().includes(locationFilter);
        const matchesDate = !dateFilter || item.dateLost === dateFilter;

        return matchesSearch && matchesCategory && matchesLocation && matchesDate;
    });

    filteredItems.sort((a, b) => {
        switch (sortFilter) {
            case 'date-asc':
                return new Date(a.dateLost) - new Date(b.dateLost);
            case 'date-desc':
                return new Date(b.dateLost) - new Date(a.dateLost);
            case 'category':
                return a.category.localeCompare(b.category);
            case 'location':
                return a.locationLost.localeCompare(b.locationLost);
            default:
                return new Date(b.dateLost) - new Date(a.dateLost);
        }
    });

    displayItems(filteredItems);
}

function clearFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('category-filter').value = '';
    document.getElementById('location-filter').value = '';
    document.getElementById('date-filter').value = '';
    document.getElementById('sort-filter').value = 'date-desc';
    applyFilters();
}

function displayItems(items) {
    const itemsGrid = document.getElementById('items-grid');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');
    
    resultsCount.textContent = `Showing ${items.length} of ${allItems.length} lost items`;
    
    if (items.length === 0) {
        itemsGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    itemsGrid.style.display = 'grid';
    noResults.style.display = 'none';
    itemsGrid.innerHTML = '';
    
    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'card';
        itemCard.onclick = () => showItemDetail(item);
        
        const canDelete = currentUser && item.user && item.user.username === currentUser;
        const icon = categoryIcons[item.category] || categoryIcons.BAG;
        const formattedDate = new Date(item.dateLost).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
        
        const photoHtml = item.photoUrl ? 
            `<div class="card-image"><img src="${item.photoUrl}" alt="${item.category}"></div>` : 
            `<div class="card-icon">${icon}</div>`;
        
        itemCard.innerHTML = `
            ${photoHtml}
            <div class="card-details">
                <p class="text-title">${item.itemName}</p>
                <p class="text-body">${item.description.length > 60 ? item.description.substring(0, 60) + '...' : item.description}</p>
                <p class="text-meta">${item.locationLost} | ${formattedDate}</p>
            </div>
            <div class="card-actions">
                <button class="card-button" onclick="event.stopPropagation(); showItemDetailById(${item.id})">More info</button>
                ${canDelete ? `<button class="card-button delete-btn" onclick="event.stopPropagation(); deleteItem(${item.id})">Delete</button>` : ''}
            </div>
        `;
        
        itemsGrid.appendChild(itemCard);
    });
}

function showItemDetail(item) {
    const modal = document.getElementById('item-modal');
    const content = document.getElementById('item-detail-content');
    
    const canDelete = currentUser && item.user && item.user.username === currentUser;
    const photoHtml = item.photoUrl ? `<img src="${item.photoUrl}" alt="${item.category}" style="max-width: 300px; border-radius: var(--radius); margin-bottom: 1rem;">` : '';
    
    content.innerHTML = `
        <h2 class="modal-title">${item.itemName} - LOST</h2>
        ${photoHtml}
        <div class="space-y-4">
            <div>
                <h3 class="form-label">Category</h3>
                <p class="text-foreground">${item.category}</p>
            </div>
            <div>
                <h3 class="form-label">Description</h3>
                <p class="text-foreground">${item.description}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <h3 class="form-label">Location Lost</h3>
                    <p class="text-foreground">${item.locationLost}</p>
                </div>
                <div>
                    <h3 class="form-label">Date Lost</h3>
                    <p class="text-foreground">${new Date(item.dateLost).toLocaleDateString()}</p>
                </div>
            </div>
            <div>
                <h3 class="form-label">Contact Info</h3>
                <p class="text-foreground">${item.contactInfo}</p>
            </div>
            <div>
                <h3 class="form-label">Posted By</h3>
                <p class="text-foreground">${item.user ? item.user.username : 'Anonymous User'}</p>
            </div>
            ${canDelete ? `
                <div class="pt-4">
                    <button class="delete-btn w-full" onclick="deleteItem(${item.id}); hideItemModal();">Delete This Item</button>
                </div>
            ` : ''}
        </div>
    `;
    
    modal.style.display = 'flex';
}

function showItemDetailById(itemId) {
    const item = allItems.find(i => i.id === itemId);
    if (item) showItemDetail(item);
}

function hideItemModal() {
    document.getElementById('item-modal').style.display = 'none';
}

async function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        alert('Please login to delete items');
        return;
    }
    
    try {
        const response = await fetch(`/api/lost-items/${itemId}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (response.ok) {
            loadItems();
            alert('Item deleted successfully!');
        } else {
            const error = await response.json();
            alert('Failed to delete item: ' + error.error);
        }
    } catch (error) {
        alert('Failed to delete item: ' + error.message);
    }
}

function updateAuthUI() {
    const token = localStorage.getItem('jwtToken');
    const username = localStorage.getItem('username');
    
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const chatNavBtn = document.getElementById('chat-nav-btn');
    
    if (token && username) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        logoutBtn.textContent = `Logout (${username})`;
        if (chatNavBtn) chatNavBtn.style.display = 'inline-block';
    } else {
        loginBtn.style.display = 'inline-block';
        registerBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        if (chatNavBtn) chatNavBtn.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}

window.onclick = function(event) {
    const itemModal = document.getElementById('item-modal');
    if (event.target === itemModal) hideItemModal();
}
